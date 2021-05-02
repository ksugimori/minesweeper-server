const request = require('supertest')
const app = require('../../../app.js')
const Point = require('../../../lib/models/util/Point')
const gameRepository = require('../../../lib/repositories/gameRepository')
jest.mock('../../../lib/repositories/gameRepository')
const mockUtils = require('../../utils/mockUtils')

describe('GET /api/games/:gameId/open-cells', () => {
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
    const response = await request(app).get('/api/games/999/open-cells')

    expect(response.statusCode).toBe(200)
    expect(response.body.map(p => `${p.x}_${p.y}`).sort()).toEqual([
      '0_1', '1_1',
      '0_2', '1_2'
    ].sort())
    expect(response.body.map(p => p.count).sort()).toEqual([
      1, 2,
      0, 1
    ].sort())
  })
})

describe('POST /api/games/:gameId/open-cells', () => {
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
    const response = await request(app).post('/api/games/999/open-cells').send(point)

    //
    // 検証
    //
    expect(response.statusCode).toBe(201)
    expect(response.body.map(p => `${p.x}_${p.y}`).sort()).toEqual([
      '0_1', '1_1',
      '0_2', '1_2'
    ].sort())
    expect(response.body.map(p => p.count).sort()).toEqual([
      1, 2,
      0, 1
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
    const response = await request(app).post('/api/games/999/open-cells').send(point)

    //
    // 検証
    //
    expect(response.statusCode).toBe(200)
    expect(response.body.map(p => `${p.x}_${p.y}`).sort()).toEqual(['0_0'].sort())
  })

  test('ゲームが終了した場合は 303 でリダイレクトされること', async () => {
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
    const response1 = await request(app).post('/api/games/999/open-cells').send({ x: 0, y: 2 })
    expect(response1.statusCode).toBe(201)
    const response = await request(app).post('/api/games/999/open-cells').send({ x: 1, y: 0 })

    //
    // 検証
    //
    expect(response.statusCode).toBe(303)
    expect(response.headers.location).toBe('/api/games/999')
  })
})

describe('DELETE /api/games/:gameId/open-cells/:id', () => {
  test('405 が返ること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = mockUtils.initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    game.open(0, 0)

    gameRepository.get = jest.fn(() => game)
    gameRepository.update = jest.fn((x) => x)

    const response = await request(app).delete('/api/games/999/open-cells/0_0')

    expect(response.statusCode).toBe(405)
  })
})
