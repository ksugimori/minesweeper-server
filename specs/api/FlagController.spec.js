const request = require('supertest')
const app = require('../../app.js')
const gameRepository = require('../../lib/repositories/gameRepository')
jest.mock('../../lib/repositories/gameRepository')
const openCellRepository = require('../../lib/repositories/openCellRepository')
jest.mock('../../lib/repositories/openCellRepository')
const mockUtils = require('../utils/mockUtils')

describe('GET /api/games/:gameId/flags', () => {
  test('フラグの一覧が取得できること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = mockUtils.initGame(3, 2, { x: 1, y: 0 }, { x: 2, y: 1 })
    game.id = 999
    game.open(0, 0)

    game.flag(2, 0)
    game.flag(1, 1)

    gameRepository.get = jest.fn(() => game)
    gameRepository.getStatus = jest.fn(() => 'PLAY')
    openCellRepository.exists = jest.fn(() => false)

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
    gameRepository.get = jest.fn(() => game)
    gameRepository.getStatus = jest.fn(() => 'PLAY')
    openCellRepository.exists = jest.fn(() => false)
    gameRepository.update = jest.fn((x) => x)

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

    gameRepository.get = jest.fn(() => game)
    gameRepository.getStatus = jest.fn(() => 'PLAY')
    openCellRepository.exists = jest.fn(() => true) // open_cells にレコードが存在する
    gameRepository.update = jest.fn((x) => x)

    const point = { x: 1, y: 0 }
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

    gameRepository.get = jest.fn(() => game)
    gameRepository.getStatus = jest.fn(() => 'PLAY')
    openCellRepository.exists = jest.fn(() => false)
    gameRepository.update = jest.fn((x) => x)

    const response = await request(app).delete('/api/games/999/flags/x1y0')

    expect(response.statusCode).toBe(204)
  })

  test('不正なIDなら 400 エラーが返されること', async () => {
    // y 座標が指定されてない
    const response = await request(app).delete('/api/games/999/flags/x100')
    expect(response.statusCode).toBe(400)
  })
})
