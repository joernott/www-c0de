// The test service of the tutorial programs that talk to the API of c0de.at (task 9.6.1). The
// recipes of c0de net send their requests to https://c0de.at/api/…, as the reader builds them;
// their tests must neither depend on the site that is online nor change its data. So the tests
// start the server of this repository with the internal certificate authority of Caddy for
// c0de.at, and the runner sends its HTTPS requests through a proxy (the system properties
// https.proxyHost/https.proxyPort, which c0de net uses when a program sets no proxy of its
// own): the proxy connects c0de.at to the test server and every other host to the real one.
// Java trusts the certificate authority of the test server besides its usual ones. The
// versions that /api/version answers come from a fake GitHub with the tags of sources.yaml.
import { spawn, spawnSync, type ChildProcess } from 'node:child_process'
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { createServer as createHttpServer, type Server } from 'node:http'
import { connect, createServer as createNetServer, type AddressInfo, type Socket } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { connect as connectTls } from 'node:tls'

export interface TestService {
  // the options of java that send the requests of the runner to the test service
  jvm: string[]
  stop(): Promise<void>
}

// usesApi tells if a program talks to the API of c0de.at.
export const usesApi = (program: string) => program.includes('"c0de.at"')

const PASSWORD = 'changeit' // the password of the trust store of Java

// startTestService starts the test service; releases are the tags that the fake GitHub
// answers, by repository (owner/name).
export async function startTestService(
  repository: string,
  releases: Record<string, string>,
): Promise<TestService> {
  const folder = mkdtempSync(join(tmpdir(), 'c0de-test-service-'))
  const closers: (() => Promise<void> | void)[] = [
    () => rmSync(folder, { recursive: true, force: true }),
  ]
  const stop = async () => {
    for (const close of closers.reverse()) await close()
  }
  try {
    const github = await listen(
      createHttpServer((request, response) => {
        const name = /^\/repos\/([^/]+\/[^/]+)\/releases/.exec(request.url ?? '')?.[1]
        const tag = name ? releases[name] : undefined
        response.writeHead(tag ? 200 : 404, { 'Content-Type': 'application/json' })
        response.end(
          JSON.stringify(tag ? [{ tag_name: tag, draft: false }] : { message: 'Not Found' }),
        )
      }),
    )
    closers.push(() => close(github))

    const binary = join(folder, process.platform === 'win32' ? 'c0de-www.exe' : 'c0de-www')
    const build = spawnSync('go', ['build', '-o', binary, './cmd/c0de-www'], {
      cwd: repository,
      encoding: 'utf-8',
    })
    if (build.error || build.status !== 0) {
      throw new Error(`building the test server needs Go: ${build.error?.message ?? build.stderr}`)
    }
    const [http, https, health] = (await freePorts(3)) as [number, number, number]
    const data = join(folder, 'data')
    const server: ChildProcess = spawn(binary, ['run'], {
      env: {
        ...process.env,
        C0DE_DOMAIN: 'c0de.at',
        C0DE_TLS: 'internal',
        C0DE_BIND: '127.0.0.1',
        C0DE_HTTP_PORT: String(http),
        C0DE_HTTPS_PORT: String(https),
        C0DE_HEALTH_PORT: String(health),
        C0DE_DATA: data,
        C0DE_GITHUB_API: `http://127.0.0.1:${port(github)}`,
      },
      stdio: ['ignore', 'ignore', 'pipe'],
    })
    let log = ''
    server.stderr?.on('data', (chunk: Buffer) => (log += chunk.toString('utf-8')))
    closers.push(
      () =>
        new Promise<void>((resolve) => {
          if (server.exitCode !== null) return resolve()
          server.once('exit', () => resolve())
          server.kill()
        }),
    )
    const root = join(data, 'caddy', 'pki', 'authorities', 'local', 'root.crt')
    await waitFor(
      () => existsSync(root) && handshake(https, readFileSync(root)),
      () => log,
    )

    const trustStore = join(folder, 'trust.p12')
    const javaHome = javaProperty('java.home')
    copyFileSync(join(javaHome, 'lib', 'security', 'cacerts'), trustStore)
    const keytool = spawnSync(
      join(javaHome, 'bin', 'keytool'),
      [
        '-importcert',
        '-noprompt',
        '-alias',
        'c0de-test',
        '-file',
        root,
        '-keystore',
        trustStore,
        '-storepass',
        PASSWORD,
      ],
      { encoding: 'utf-8', timeout: 30000 },
    )
    if (keytool.status !== 0) throw new Error(`keytool: ${keytool.stderr}${keytool.stdout}`)

    const proxy = await listen(createNetServer((client) => tunnel(client, https)))
    closers.push(() => close(proxy))

    return {
      jvm: [
        '-Dhttps.proxyHost=127.0.0.1',
        `-Dhttps.proxyPort=${port(proxy)}`,
        `-Djavax.net.ssl.trustStore=${trustStore}`,
        `-Djavax.net.ssl.trustStorePassword=${PASSWORD}`,
        '-Djavax.net.ssl.trustStoreType=PKCS12',
      ],
      stop,
    }
  } catch (error) {
    await stop()
    throw error
  }
}

// tunnel answers a CONNECT request: c0de.at goes to the test server, other hosts to themselves.
function tunnel(client: Socket, testServer: number) {
  let head = Buffer.alloc(0)
  const onData = (chunk: Buffer) => {
    head = Buffer.concat([head, chunk])
    const end = head.indexOf('\r\n\r\n')
    if (end < 0) {
      if (head.length > 8192) client.destroy()
      return
    }
    client.off('data', onData)
    const match = /^CONNECT ([^\s:]+):(\d+) HTTP\/1\.[01]\r\n/.exec(head.toString('latin1'))
    if (!match) {
      client.end('HTTP/1.1 400 Bad Request\r\n\r\n')
      return
    }
    const [host, target] =
      match[1] === 'c0de.at' ? ['127.0.0.1', testServer] : [match[1]!, Number(match[2])]
    const upstream = connect(target, host, () => {
      client.write('HTTP/1.1 200 Connection Established\r\n\r\n')
      const rest = head.subarray(end + 4)
      if (rest.length > 0) upstream.write(rest)
      client.pipe(upstream).pipe(client)
    })
    upstream.on('error', () => client.end('HTTP/1.1 502 Bad Gateway\r\n\r\n'))
    client.on('error', () => upstream.destroy())
  }
  client.on('data', onData)
}

// handshake tells if the test server answers TLS for c0de.at with a certificate of its root.
function handshake(port: number, root: Buffer): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = connectTls({ host: '127.0.0.1', port, servername: 'c0de.at', ca: root }, () => {
      socket.end()
      resolve(true)
    })
    socket.on('error', () => resolve(false))
  })
}

async function waitFor(ready: () => boolean | Promise<boolean>, log: () => string) {
  for (let i = 0; i < 300; i++) {
    if (await ready()) return
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error(`the test server didn't start:\n${log()}`)
}

function javaProperty(name: string): string {
  const result = spawnSync('java', ['-XshowSettings:properties', '-version'], { encoding: 'utf-8' })
  const line = result.stderr.split('\n').find((l) => l.trim().startsWith(`${name} = `))
  if (!line) throw new Error(`java doesn't name its ${name}`)
  return line.trim().slice(name.length + 3)
}

function listen<T extends Server | ReturnType<typeof createNetServer>>(server: T): Promise<T> {
  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

const port = (server: Server | ReturnType<typeof createNetServer>) =>
  (server.address() as AddressInfo).port

const close = (server: Server | ReturnType<typeof createNetServer>) =>
  new Promise<void>((resolve) => server.close(() => resolve()))

async function freePorts(count: number): Promise<number[]> {
  const servers = await Promise.all(Array.from({ length: count }, () => listen(createNetServer())))
  const ports = servers.map(port)
  await Promise.all(servers.map(close))
  return ports
}
