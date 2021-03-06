const request = require('supertest')
const app = require('../../app.js')
const Point = require('../../lib/models/util/Point')
const GameRepository = require('../../lib/repositories/GameRepository')
jest.mock('../../lib/repositories/GameRepository')
const CellRepository = require('../../lib/repositories/CellRepository')
jest.mock('../../lib/repositories/CellRepository')
const mockUtils = require('../utils/mockUtils')
const pool = require('../../lib/db/pool')
jest.mock('../../lib/db/pool')

beforeAll(() => {
  pool.promise = () => ({
    getConnection: () => ({
      query: () => {},
      release: () => {}
    })
  })

  CellRepository.use = jest.fn().mockReturnValue({
    upsertAll: () => {}
  })
})

describe('GET /api/games/:gameId/open-cells', () => {
  test('開いているセルの一覧が取得できること', async () => {
    // |1|*|2|
    // |1|2|*|
    // |0|1|1|
    const game = mockUtils.initGame(3, 3, Point.of(1, 0), Point.of(2, 1))
    game.id = 999

    // 0 なので周囲４セルも開かれる
    game.open(0, 2)

    GameRepository.use = jest.fn().mockReturnValue({
      get: () => game,
      update: (x) => x,
      updateToStart: () => {}
    })

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

    GameRepository.use = jest.fn().mockReturnValue({
      get: () => game,
      update: (x) => x,
      updateToStart: () => {}
    })

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
})

describe('DELETE /api/games/:gameId/open-cells/:id', () => {
  test('405 が返ること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = mockUtils.initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    game.open(0, 0)

    GameRepository.mockImplementation(() => {
      return {
        get: () => game,
        update: (x) => x,
        updateToStart: () => {}
      }
    })

    const response = await request(app).delete('/api/games/999/open-cells/0_0')

    expect(response.statusCode).toBe(405)
  })
})
