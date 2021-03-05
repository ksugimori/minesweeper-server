const request = require('supertest')
const app = require('../app.js')

describe('GET /', () => {
  test('ルートページに Express という文字列が存在すること', async () => {
    const response = await request(app).get('/')

    expect(response.statusCode).toBe(200)
    expect(response.text).toMatch(/Express/)
  })
})
