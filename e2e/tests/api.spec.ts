import { expect, test } from '@playwright/test'

// The API of the recipes of c0de net (task 9.1). It has a rate limit per client, so it is
// tested in one browser only.

test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'the API is the same for every browser')
})

test('the echo sends the request back', async ({ request }) => {
  const answer = await request.put('/api/tutorial/echo/lamps/attic?on=true', {
    data: { on: true },
    headers: { 'X-Lamp': 'attic' },
  })
  expect(answer.status()).toBe(200)
  expect(answer.headers()['cache-control']).toBe('no-store')
  const echoed = await answer.json()
  expect(echoed).toMatchObject({
    method: 'PUT',
    path: '/api/tutorial/echo/lamps/attic',
    query: 'on=true',
    body: '{"on":true}',
  })
  expect(echoed.headers['x-lamp']).toBe('attic')
})

test('the to-do list keeps entries until they are deleted', async ({ request }) => {
  const created = await request.post('/api/tutorial/todo', { data: { title: 'Feed the cats' } })
  expect(created.status()).toBe(201)
  const entry = await created.json()
  expect(entry).toMatchObject({ title: 'Feed the cats', done: false })
  const url = `/api/tutorial/todo/${entry.id}`
  expect(created.headers()['location']).toBe(url)

  const changed = await request.patch(url, { data: { done: true } })
  expect(await changed.json()).toMatchObject({ id: entry.id, done: true })
  expect(await (await request.get('/api/tutorial/todo')).json()).toContainEqual({
    ...entry,
    done: true,
  })

  expect((await request.delete(url)).status()).toBe(204)
  expect((await request.get(url)).status()).toBe(404)
})

test('unknown paths of the API answer in JSON', async ({ request }) => {
  const answer = await request.get('/api/missing')
  expect(answer.status()).toBe(404)
  expect(await answer.json()).toHaveProperty('error')
})

test('the version check answers the latest versions of the mods', async ({ request }) => {
  const answer = await request.get('/api/version')
  expect(answer.status()).toBe(200)
  const versions = await answer.json()
  expect(versions.c0de).toMatch(/^\d+\.\d+\.\d+/)
  expect(versions.c0de_net).toMatch(/^\d+\.\d+\.\d+/)
})
