const request = require('supertest')
const app = require('../../app.js')
const mockUtils = require('../utils/mockUtils')
const GameRepository = require('../../lib/repositories/GameRepository')
const CellRepository = require('../../lib/repositories/CellRepository')
const pool = require('../../lib/db/pool')
const Status = require('../../lib/models/status/Status')
jest.mock('../../lib/repositories/GameRepository')
jest.mock('../../lib/db/pool')

beforeAll(() => {
  pool.promise = () => ({
    getConnection: () => ({
      query: () => {},
      release: () => {}
    })
  })
})

describe('GET /api/games/:gameId/flags', () => {
  test('フラグの一覧が取得できること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = mockUtils.initGame(3, 2, { x: 1, y: 0 }, { x: 2, y: 1 })
    game.id = 999
    game.open(0, 0)

    game.flag(2, 0)
    game.flag(1, 1)

    game.field.all().forEach(cell => {
      cell.isChanged = false
    })
    game.status = Status.PLAY

    GameRepository.use = jest.fn().mockReturnValue({
      get: () => game
    })

    // API コール
    const response = await request(app).get('/api/games/999/flags')

    expect(response.body).toEqual([{ x: 1, y: 1 }, { x: 2, y: 0 }])
  })
})

describe('POST /api/games/:gameId/flags', () => {
  test('フラグが追加できること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = mockUtils.initGame(3, 2, { x: 1, y: 0 }, { x: 2, y: 1 })
    game.id = 999
    game.open(0, 0)

    game.field.all().forEach(cell => {
      cell.isChanged = false
    })
    game.status = Status.PLAY

    GameRepository.use = jest.fn().mockReturnValue({
      get: () => game
    })
    CellRepository.use = jest.fn().mockReturnValue({
      upsertAll: () => {}
    })

    const point = { x: 1, y: 0 }
    const response = await request(app).post('/api/games/999/flags').send(point)

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({ x: 1, y: 0 })
  })

  test('すでに開かれたセルの場合は 200 が返却されること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = mockUtils.initGame(3, 2, { x: 1, y: 0 }, { x: 2, y: 1 })
    game.id = 999
    game.open(0, 0)
    game.flag(1, 0)

    game.field.all().forEach(cell => {
      cell.isChanged = false
    })
    game.status = Status.PLAY

    GameRepository.use = jest.fn().mockReturnValue({
      get: () => game,
      update: (x) => x
    })

    const point = { x: 0, y: 0 }
    const response = await request(app).post('/api/games/999/flags').send(point)

    expect(response.statusCode).toBe(200)
  })
})

describe('DELETE /api/games/:gameId/flags/:id', () => {
  test('フラグが外されること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = mockUtils.initGame(3, 2, { x: 1, y: 0 }, { x: 2, y: 1 })
    game.id = 999
    game.open(0, 0)

    game.flag(1, 0)

    game.field.all().forEach(cell => {
      cell.isChanged = false
    })
    game.status = Status.PLAY

    GameRepository.use = jest.fn().mockReturnValue({
      get: () => game,
      update: (x) => x
    })

    const response = await request(app).delete('/api/games/999/flags/x1y0')

    expect(response.statusCode).toBe(204)
  })

  test('不正なIDなら 400 エラーが返されること', async () => {
    // y 座標が指定されてない
    const response = await request(app).delete('/api/games/999/flags/x100')
    expect(response.statusCode).toBe(400)
  })
})
