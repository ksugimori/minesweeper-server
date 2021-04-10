const request = require('supertest')
const app = require('../../../app.js')
const Point = require('../../../lib/models/util/Point')
const gameRepository = require('../../../lib/repositories/gameRepository')
jest.mock('../../../lib/repositories/gameRepository')
const mockUtils = require('../../utils/mockUtils')

describe('GET /api/games/:gameId/cells/flag', () => {
  test('フラグの一覧が取得できること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = mockUtils.initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    game.open(0, 0)

    game.flag(2, 0)
    game.flag(1, 1)

    gameRepository.get = jest.fn(() => game)

    // API コール
    const response = await request(app).get('/api/games/999/cells/flag')

    expect(response.body).toEqual([{ x: 1, y: 1 }, { x: 2, y: 0 }])
  })
})

describe('POST /api/games/:gameId/cells/flag', () => {
  test('フラグが追加できること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = mockUtils.initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    game.open(0, 0)
    gameRepository.get = jest.fn(() => game)
    gameRepository.update = jest.fn((x) => x)

    const point = { x: 1, y: 0 }
    const response = await request(app).post('/api/games/999/cells/flag').send(point)

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({ x: 1, y: 0 })

    expect(game.field.cellAt(point).isFlag).toBeTruthy()
  })

  test('すでにフラグが存在する場合は 204 が返却されること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = mockUtils.initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    game.open(0, 0)
    game.flag(1, 0)
    gameRepository.get = jest.fn(() => game)
    gameRepository.update = jest.fn((x) => x)

    const point = { x: 1, y: 0 }
    const response = await request(app).post('/api/games/999/cells/flag').send(point)

    expect(response.statusCode).toBe(204)

    expect(game.field.cellAt(point).isFlag).toBeTruthy()
  })
})

describe('DELETE /api/games/:gameId/cells/flag/:id', () => {
  test('フラグが外されること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = mockUtils.initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    game.open(0, 0)

    game.flag(1, 0)

    gameRepository.get = jest.fn(() => game)
    gameRepository.update = jest.fn((x) => x)

    const response = await request(app).delete('/api/games/999/cells/flag/1_0')

    expect(response.statusCode).toBe(204)

    expect(game.field.cellAt(Point.of(1, 0)).isFlag).toBeFalsy()
  })
})

describe('GET /api/games/:gameId/cells/open', () => {
  test('開いているセルの一覧が取得できること', async () => {
    // |1|*|2|
    // |1|2|*|
    // |0|1|1|
    const game = mockUtils.initGame(3, 3, Point.of(1, 0), Point.of(2, 1))
    game.id = 999

    // 0 なので周囲４セルも開かれる
    game.open(0, 2)

    gameRepository.get = jest.fn(() => game)

    // API コール
    const response = await request(app).get('/api/games/999/cells/open')

    expect(response.statusCode).toBe(200)
    expect(response.body.map(p => `${p.x}_${p.y}`).sort()).toEqual([
      '0_1', '1_1',
      '0_2', '1_2'
    ].sort())
  })
})

describe('POST /api/games/:gameId/cells/open', () => {
  test('セルが開けること', async () => {
    // |1|*|2|
    // |1|2|*|
    // |0|1|1|
    const game = mockUtils.initGame(3, 3, Point.of(1, 0), Point.of(2, 1))
    game.id = 999

    gameRepository.get = jest.fn(() => game)
    gameRepository.update = jest.fn((x) => x)

    //
    // テスト
    //
    const point = { x: 0, y: 2 }
    const response = await request(app).post('/api/games/999/cells/open').send(point)

    //
    // 検証
    //
    expect(response.statusCode).toBe(201)
    expect(response.body.map(p => `${p.x}_${p.y}`).sort()).toEqual([
      '0_1', '1_1',
      '0_2', '1_2'
    ].sort())
  })

  test('すでに開かれたセルの場合は 200 が返却されること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = mockUtils.initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    game.open(0, 0)
    gameRepository.get = jest.fn(() => game)
    gameRepository.update = jest.fn((x) => x)

    //
    // テスト
    //
    const point = { x: 0, y: 0 }
    const response = await request(app).post('/api/games/999/cells/open').send(point)

    //
    // 検証
    //
    expect(response.statusCode).toBe(200)
    expect(response.body.map(p => `${p.x}_${p.y}`).sort()).toEqual(['0_0'].sort())
  })
})

describe('DELETE /api/games/:gameId/cells/open/:id', () => {
  test('405 が返ること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = mockUtils.initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    game.open(0, 0)

    gameRepository.get = jest.fn(() => game)
    gameRepository.update = jest.fn((x) => x)

    const response = await request(app).delete('/api/games/999/cells/open/0_0')

    expect(response.statusCode).toBe(405)
  })
})
