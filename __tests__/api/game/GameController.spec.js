const request = require('supertest')
const app = require('../../../app.js')
const Status = require('../../../models/status/Status')

describe('POST /api/games', () => {
  test('Game オブジェクトが返されること', async () => {
    const game = {
      setting: {
        width: 3,
        height: 2,
        numMines: 1
      }
    }

    const response = await request(app).post('/api/games').send(game)

    expect(response.statusCode).toBe(201)
    expect(response.body.setting.width).toBe(3)
    expect(response.body.setting.height).toBe(2)
    expect(response.body.setting.numMines).toBe(1)
    expect(response.body.field.width).toBe(3)
    expect(response.body.field.height).toBe(2)
    expect(response.body.status).toEqual(Status.INIT)
  })
})
