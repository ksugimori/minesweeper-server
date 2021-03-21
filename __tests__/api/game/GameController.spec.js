const request = require('supertest')
const app = require('../../../app.js')
const pool = require('../../../db/pool')
const Game = require('../../../models/Game.js')
jest.mock('../../../db/pool')

describe('POST /api/games', () => {
  test('Game オブジェクトが返されること', async () => {
    const game = {
      setting: {
        width: 3,
        height: 2,
        numMines: 1
      }
    }

    const mockConnection = {
      format: jest.fn(),
      query: jest.fn()
    }
    mockConnection.query.mockReturnValueOnce([[new Game()], null])
    pool.promise.mockReturnValueOnce(mockConnection)

    const response = await request(app).post('/api/games').send(game)

    expect(response.statusCode).toBe(201)
  })
})
