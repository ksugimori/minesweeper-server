const request = require('supertest')
const app = require('../../app.js')
const Game = require('../../lib/models/Game')
const DataNotFoundException = require('../../lib/exceptions/DataNotFoundException')
const gameRepository = require('../../lib/repositories/gameRepository')
jest.mock('../../lib/repositories/gameRepository')
const mockUtils = require('../utils/mockUtils')
const Point = require('../../lib/models/util/Point')

describe('POST /api/games', () => {
  test('Game オブジェクトが返されること', async () => {
    // INSERT 時に ID が割り当てられる挙動をモックで再現
    gameRepository.create = jest.fn(arg => {
      arg.id = 999
      return arg
    })

    const req = { width: 3, height: 2, numMines: 1 }

    const response = await request(app).post('/api/games').send(req)

    expect(response.statusCode).toBe(201)
    expect(response.body.id).toBe(999)
  })

  test('width がセットされていない場合は 400 エラーになること', async () => {
    const req = { height: 2, numMines: 1 }

    const response = await request(app).post('/api/games').send(req)

    expect(response.statusCode).toBe(400)
  })

  test('height がセットされていない場合は 400 エラーになること', async () => {
    const req = { width: 2, numMines: 1 }

    const response = await request(app).post('/api/games').send(req)

    expect(response.statusCode).toBe(400)
  })

  test('numMines がセットされていない場合は 400 エラーになること', async () => {
    const req = { width: 3, height: 2 }

    const response = await request(app).post('/api/games').send(req)

    expect(response.statusCode).toBe(400)
  })
})

describe('GET /api/games/{id}', () => {
  test('取得できた場合はステータス 200 が返ること', async () => {
    const game = new Game()
    game.id = 999
    gameRepository.get = jest.fn(() => game)

    const response = await request(app).get('/api/games/1')

    expect(response.statusCode).toBe(200)
    expect(response.body.id).toBe(999)
  })

  test('取得できなかった場合はステータス 404 が返ること', async () => {
    gameRepository.get = jest.fn(() => {
      throw new DataNotFoundException()
    })

    const response = await request(app).get('/api/games/1')

    expect(response.statusCode).toBe(404)
  })
})
