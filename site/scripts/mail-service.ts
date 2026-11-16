// The test mail server of the recipes of c0de_net/mail (task 13.9): GreenMail, the standalone
// jar from Maven Central (cached in .cache/greenmail), so the recipes run in CI and on the VM
// without a real mail provider. Mail connections don't go through the proxy of the test service,
// so the recipes take the server and the port as parameters, as players set them for their
// provider anyway, and their options files name GreenMail: 127.0.0.1 with the fixed ports of
// GreenMail's test setup, SMTPS 3465 and IMAPS 3993. The password comes from the vault, as the
// recipes teach it. GreenMail encrypts with a certificate of its own for 127.0.0.1, which the
// trust store of the runner's Java contains: the recipes use `tls` without skip_ssl_validation.
//
// Before every run of a mail program, reset() empties GreenMail and puts the folders and
// messages of MAILBOXES into the mailboxes over plain IMAP (APPEND), so every run starts from
// the same mailboxes. received() returns what a mailbox holds after a run, for the expected
// files <name>[.<case>].received.yaml of test-programs.ts.
import { spawn, spawnSync, type ChildProcess } from 'node:child_process'
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { connect, createServer, type AddressInfo, type Socket } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export const GREENMAIL = '2.1.15'

// The ports of GreenMail's test setup; the options files of the recipes name SMTPS and IMAPS.
export const PORTS = { smtp: 3025, smtps: 3465, imap: 3143, imaps: 3993 }

// The users of the recipes, all with the password PASSWORD: steve has the mailbox of the farm,
// alex and sam order from it.
export const USERS = ['steve@example.com', 'alex@example.com', 'sam@example.com']
export const PASSWORD = 'secret'

const STORE_PASSWORD = 'changeit' // the password of the key store and the trust store

export interface Message {
  from: string
  to: string
  subject: string
  date: string // RFC 5322, like "Sat, 14 Nov 2026 09:30:00 +0000"
  text: string
  flags?: string[] // like \Seen
}

// The folders and messages the mailboxes have before every run, by user and folder.
export const MAILBOXES: Record<string, Record<string, Message[]>> = {
  'steve@example.com': {
    INBOX: [
      {
        from: 'Alex <alex@example.com>',
        to: 'steve@example.com',
        subject: 'Order: 32 wheat',
        date: 'Sat, 14 Nov 2026 09:30:00 +0000',
        text: 'Hi Steve,\r\nplease bring 32 wheat to the north gate.\r\nAlex',
      },
      {
        from: 'Village news <news@example.com>',
        to: 'steve@example.com',
        subject: 'Village news: the market moves',
        date: 'Mon, 02 Nov 2026 07:00:00 +0000',
        text: 'The market moves to the square by the well.',
        flags: ['\\Seen'],
      },
      {
        from: 'Sam <sam@example.com>',
        to: 'steve@example.com',
        subject: 'Order: 12 carrots',
        date: 'Sun, 15 Nov 2026 16:05:00 +0000',
        text: 'Twelve carrots for the horses, please. Sam',
      },
      {
        from: 'Alex <alex@example.com>',
        to: 'steve@example.com',
        subject: 'Thanks for the bread',
        date: 'Tue, 10 Nov 2026 18:20:00 +0000',
        text: 'The bread was great!',
        flags: ['\\Seen'],
      },
      {
        from: 'Sam <sam@example.com>',
        to: 'steve@example.com',
        subject: 'Order: 5 pumpkins',
        date: 'Mon, 09 Nov 2026 11:45:00 +0000',
        text: 'Five pumpkins for the festival.',
        flags: ['\\Seen', '\\Answered'],
      },
      {
        from: 'Village news <news@example.com>',
        to: 'steve@example.com',
        subject: 'Village news: harvest festival',
        date: 'Mon, 16 Nov 2026 07:00:00 +0000',
        text: 'The harvest festival is on Saturday.',
      },
    ],
    Orders: [
      {
        from: 'Alex <alex@example.com>',
        to: 'steve@example.com',
        subject: 'Order: 8 bread',
        date: 'Thu, 05 Nov 2026 08:10:00 +0000',
        text: 'Eight loaves, please.',
        flags: ['\\Seen', '\\Answered'],
      },
      {
        from: 'Sam <sam@example.com>',
        to: 'steve@example.com',
        subject: 'Order: 16 eggs',
        date: 'Fri, 13 Nov 2026 12:00:00 +0000',
        text: 'Sixteen eggs for the bakery, by Friday.',
        flags: ['\\Flagged'],
      },
    ],
    Archive: [
      {
        from: 'Sam <sam@example.com>',
        to: 'steve@example.com',
        subject: 'Order: 20 potatoes',
        date: 'Fri, 12 Dec 2025 10:00:00 +0000',
        text: 'Twenty potatoes.',
        flags: ['\\Seen', '\\Answered'],
      },
    ],
    'Archive 2024': [
      {
        from: 'Alex <alex@example.com>',
        to: 'steve@example.com',
        subject: 'Order: 3 cakes',
        date: 'Wed, 18 Dec 2024 15:00:00 +0000',
        text: 'Three cakes for the party.',
        flags: ['\\Seen', '\\Answered'],
      },
    ],
  },
}

export interface Received {
  from: string
  to: string[]
  cc: string[]
  subject: string
  text: string
  flags: string[] // sorted, without \Recent
}

export interface MailService {
  // the options of java that make the runner trust GreenMail
  jvm: string[]
  // reset empties GreenMail and fills the mailboxes of MAILBOXES
  reset(): Promise<void>
  // received returns the messages in a folder of a user, oldest first
  received(user: string, folder?: string): Promise<Received[]>
  stop(): Promise<void>
}

// usesMail tells if a program includes c0de_net/mail.
export const usesMail = (program: string) => /^\s*INCLUDE c0de_net\/mail\s*$/m.test(program)

// download returns the cached jar of GreenMail standalone.
async function download(cache: string): Promise<string> {
  const jar = join(cache, `greenmail-standalone-${GREENMAIL}.jar`)
  if (existsSync(jar)) return jar
  mkdirSync(cache, { recursive: true })
  const url = `https://repo1.maven.org/maven2/com/icegreen/greenmail-standalone/${GREENMAIL}/greenmail-standalone-${GREENMAIL}.jar`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: ${response.status} ${response.statusText}`)
  writeFileSync(jar, Buffer.from(await response.arrayBuffer()))
  return jar
}

// startMailService starts GreenMail; cache is the folder of its jar.
export async function startMailService(cache: string): Promise<MailService> {
  const jar = await download(cache)
  const folder = mkdtempSync(join(tmpdir(), 'c0de-mail-service-'))
  const closers: (() => Promise<void> | void)[] = [
    () => rmSync(folder, { recursive: true, force: true }),
  ]
  const stop = async () => {
    for (const close of closers.reverse()) await close()
  }
  try {
    const javaHome = javaProperty('java.home')
    const keytool = (args: string[]) => {
      const result = spawnSync(join(javaHome, 'bin', 'keytool'), args, {
        encoding: 'utf-8',
        timeout: 30000,
      })
      if (result.status !== 0) throw new Error(`keytool: ${result.stderr}${result.stdout}`)
    }
    const keyStore = join(folder, 'greenmail.p12')
    const certificate = join(folder, 'greenmail.crt')
    const trustStore = join(folder, 'trust.p12')
    const store = ['-keystore', keyStore, '-storepass', STORE_PASSWORD, '-storetype', 'PKCS12']
    keytool([
      ...['-genkeypair', '-alias', 'greenmail', '-keyalg', 'EC', '-dname', 'CN=localhost'],
      ...['-ext', 'SAN=ip:127.0.0.1,dns:localhost', '-validity', '2', ...store],
    ])
    keytool(['-exportcert', '-rfc', '-alias', 'greenmail', '-file', certificate, ...store])
    copyFileSync(join(javaHome, 'lib', 'security', 'cacerts'), trustStore)
    chmodSync(trustStore, 0o600) // cacerts may be read-only, and so is its copy
    keytool([
      ...['-importcert', '-noprompt', '-alias', 'greenmail', '-file', certificate],
      ...['-keystore', trustStore, '-storepass', STORE_PASSWORD],
    ])

    const api = await freePort()
    const users = USERS.map((user) => {
      const [login, domain] = user.split('@')
      return `${login}:${PASSWORD}@${domain}`
    })
    // the java of java.home: on Windows, "java" may be a launcher that starts it as a child,
    // which kill() wouldn't stop
    const server: ChildProcess = spawn(
      join(javaHome, 'bin', 'java'),
      [
        '-Dgreenmail.setup.test.smtp',
        '-Dgreenmail.setup.test.smtps',
        '-Dgreenmail.setup.test.imap',
        '-Dgreenmail.setup.test.imaps',
        '-Dgreenmail.hostname=127.0.0.1',
        `-Dgreenmail.users=${users.join(',')}`,
        '-Dgreenmail.users.login=email',
        `-Dgreenmail.tls.keystore.file=${keyStore}`,
        `-Dgreenmail.tls.keystore.password=${STORE_PASSWORD}`,
        '-Dgreenmail.api.hostname=127.0.0.1',
        `-Dgreenmail.api.port=${api}`,
        '-jar',
        jar,
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    )
    let log = ''
    server.stdout?.on('data', (chunk: Buffer) => (log += chunk.toString('utf-8')))
    server.stderr?.on('data', (chunk: Buffer) => (log += chunk.toString('utf-8')))
    closers.push(
      () =>
        new Promise<void>((resolve) => {
          if (server.exitCode !== null) return resolve()
          server.once('exit', () => resolve())
          server.kill()
        }),
    )
    const base = `http://127.0.0.1:${api}/api`
    const ready = async () => {
      for (let i = 0; i < 300; i++) {
        if (server.exitCode !== null) break
        const ok = await fetch(`${base}/service/readiness`).then(
          (r) => r.ok,
          () => false,
        )
        if (ok) return
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      throw new Error(`the test mail server didn't start:\n${log}`)
    }
    await ready()

    const reset = async () => {
      const response = await fetch(`${base}/service/reset`, { method: 'POST' })
      if (!response.ok) throw new Error(`resetting GreenMail: ${response.status}\n${log}`)
      await ready()
      for (const [user, folders] of Object.entries(MAILBOXES)) {
        await fill(user, folders)
      }
    }

    return {
      jvm: [
        `-Djavax.net.ssl.trustStore=${trustStore}`,
        `-Djavax.net.ssl.trustStorePassword=${STORE_PASSWORD}`,
        '-Djavax.net.ssl.trustStoreType=PKCS12',
      ],
      reset,
      received: (user, folder = 'INBOX') => read(user, folder),
      stop,
    }
  } catch (error) {
    await stop()
    throw error
  }
}

// Imap is a minimal client of plain IMAP for filling and reading the mailboxes of GreenMail.
class Imap {
  private buffer = ''
  private waiting?: () => void
  private tag = 0
  private socket: Socket

  private constructor(socket: Socket) {
    this.socket = socket
    socket.setEncoding('utf-8')
    socket.on('data', (chunk: string) => {
      this.buffer += chunk
      this.waiting?.()
    })
  }

  static async open(user: string): Promise<Imap> {
    const socket = await new Promise<Socket>((resolve, reject) => {
      const s = connect(PORTS.imap, '127.0.0.1', () => resolve(s))
      s.once('error', reject)
    })
    const imap = new Imap(socket)
    await imap.until((b) => b.includes('\r\n'))
    await imap.command(`LOGIN "${user}" "${PASSWORD}"`)
    return imap
  }

  private until(done: (buffer: string) => boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`IMAP: no answer:\n${this.buffer}`)), 10000)
      const check = () => {
        if (!done(this.buffer)) return
        clearTimeout(timer)
        this.waiting = undefined
        resolve()
      }
      this.waiting = check
      check()
    })
  }

  // command sends a command (with a literal, if given) and returns the lines of its answer.
  async command(line: string, literal?: string): Promise<string> {
    const tag = `A${++this.tag}`
    this.buffer = ''
    if (literal === undefined) {
      this.socket.write(`${tag} ${line}\r\n`)
    } else {
      this.socket.write(`${tag} ${line} {${Buffer.byteLength(literal)}}\r\n`)
      await this.until((b) => b.startsWith('+'))
      this.buffer = ''
      this.socket.write(`${literal}\r\n`)
    }
    const end = new RegExp(`^${tag} (OK|NO|BAD)[^\\r]*\\r\\n`, 'm')
    await this.until((b) => end.test(b))
    const answer = this.buffer
    if (!new RegExp(`^${tag} OK`, 'm').test(answer)) {
      throw new Error(`IMAP ${line}: ${answer}`)
    }
    return answer
  }

  close() {
    this.socket.end()
  }
}

// fill creates the folders of a user and appends their messages.
async function fill(user: string, folders: Record<string, Message[]>) {
  const imap = await Imap.open(user)
  try {
    for (const [folder, messages] of Object.entries(folders)) {
      if (folder !== 'INBOX') await imap.command(`CREATE "${folder}"`)
      for (const m of messages) {
        const text = [
          `From: ${m.from}`,
          `To: ${m.to}`,
          `Subject: ${m.subject}`,
          `Date: ${m.date}`,
          `Message-ID: <${m.date.replace(/\W/g, '')}.${m.subject.replace(/\W/g, '')}@example.com>`,
          'MIME-Version: 1.0',
          'Content-Type: text/plain; charset=UTF-8',
          '',
          m.text,
        ].join('\r\n')
        await imap.command(`APPEND "${folder}" (${(m.flags ?? []).join(' ')})`, text)
      }
    }
  } finally {
    imap.close()
  }
}

// read returns the messages of a folder, oldest first.
async function read(user: string, folder: string): Promise<Received[]> {
  const imap = await Imap.open(user)
  try {
    const selected = await imap.command(`SELECT "${folder}"`)
    if (/^\* 0 EXISTS/m.test(selected)) return []
    const answer = await imap.command(
      'FETCH 1:* (FLAGS BODY.PEEK[HEADER.FIELDS (FROM TO CC SUBJECT)] BODY.PEEK[TEXT])',
    )
    const result: Received[] = []
    for (const part of answer.split(/^\* \d+ FETCH /m).slice(1)) {
      // the server answers the parts in any order, each as a literal behind its name
      const literals: Record<string, string> = {}
      for (const match of part.matchAll(/BODY\[(HEADER|TEXT)[^\]]*\] \{(\d+)\}\r\n/g)) {
        const start = match.index + match[0].length
        literals[match[1]!] = Buffer.from(part.slice(start), 'utf-8')
          .subarray(0, Number(match[2]))
          .toString('utf-8')
      }
      const headers = unfold(literals.HEADER ?? '')
      const list = (value: string | undefined) =>
        value ? value.split(',').map((address) => address.trim()) : []
      result.push({
        from: headers.from ?? '',
        to: list(headers.to),
        cc: list(headers.cc),
        subject: headers.subject ?? '',
        text: (literals.TEXT ?? '').replace(/\r\n/g, '\n').trimEnd(),
        flags: (/FLAGS \(([^)]*)\)/.exec(part)?.[1] ?? '')
          .split(' ')
          .filter((flag) => flag && flag !== '\\Recent')
          .sort(),
      })
    }
    return result
  } finally {
    imap.close()
  }
}

// unfold reads header lines into a map with lower case names.
function unfold(text: string): Record<string, string> {
  const headers: Record<string, string> = {}
  for (const line of text.replace(/\r\n[ \t]+/g, ' ').split('\r\n')) {
    const colon = line.indexOf(':')
    if (colon > 0) headers[line.slice(0, colon).toLowerCase()] = line.slice(colon + 1).trim()
  }
  return headers
}

function javaProperty(name: string): string {
  const result = spawnSync('java', ['-XshowSettings:properties', '-version'], { encoding: 'utf-8' })
  const line = result.stderr.split('\n').find((l) => l.trim().startsWith(`${name} = `))
  if (!line) throw new Error(`java doesn't name its ${name}`)
  return line.trim().slice(name.length + 3)
}

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const port = (server.address() as AddressInfo).port
      server.close(() => resolve(port))
    })
  })
}
