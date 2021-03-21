const request = require('supertest')
const app = require('../../../app.js')
const gameRepository = require('../../../repositories/gameRepository')
jest.mock('../../../repositories/gameRepository')

describe('POST /api/games', () => {
  test('Game オブジェクトが返されること', async () => {
    // INSERT 時に ID が割り当てられる挙動をモックで再現
    gameRepository.create = jest.fn(arg => {
      arg.id = 999
      return arg
    })

    const game = {
      setting: {
        width: 3,
        height: 2,
        numMines: 1
      },
      stopWatch: {
        startTime: 0
      }
    }
    const response = await request(app).post('/api/games').send(game)

    expect(response.statusCode).toBe(201)
    expect(response.body.id).toBe(999)
  })
})

describe('GET /api/games/{id}', () => {
  test('取得できた場合はステータス 200 が返ること', async () => {
    gameRepository.get = jest.fn(() => ({ id: 999 }))

    const response = await request(app).get('/api/games/1')

    expect(response.statusCode).toBe(200)
    expect(response.body.id).toBe(999)
  })

  test('取得できなかった場合はステータス 404 が返ること', async () => {
    gameRepository.get = jest.fn(() => null)

    const response = await request(app).get('/api/games/1')

    expect(response.statusCode).toBe(404)
  })
})
