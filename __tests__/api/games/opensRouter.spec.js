const request = require('supertest')
const app = require('../../../app.js')
const Game = require('../../../models/Game')
const random = require('../../../models/util/random')
const Point = require('../../../models/util/Point')
const gameRepository = require('../../../repositories/gameRepository')
jest.mock('../../../repositories/gameRepository')

/**
 * Game オブジェクトを初期化する。
 * @param {Number} width 幅
 * @param {Number} height 高さ
 * @param {Array} mines 地雷の座標
 */
function initGame (width, height, ...mines) {
  const game = new Game()

  const numMines = mines.length
  game.setting.merge({ width, height, numMines })

  // ランダムな地雷の配置はモックする
  const spy = jest.spyOn(random, 'points')
  spy.mockReturnValue(mines)

  game.initialize()

  return game
}

describe('GET /api/games/:gameId/opens', () => {
  test('開いているセルの一覧が取得できること', async () => {
    // |1|*|2|
    // |1|2|*|
    // |0|1|1|
    const game = initGame(3, 3, Point.of(1, 0), Point.of(2, 1))
    game.id = 999

    // 0 なので周囲４セルも開かれる
    game.open(0, 2)

    gameRepository.get = jest.fn(() => game)

    // API コール
    const response = await request(app).get('/api/games/999/opens')

    expect(response.statusCode).toBe(200)
    expect(response.body.map(p => `${p.x}_${p.y}`).sort()).toEqual([
      '0_1', '1_1',
      '0_2', '1_2'
    ].sort())
  })
})

describe('POST /api/games/:gameId/opens', () => {
  test('セルが開けること', async () => {
    // |1|*|2|
    // |1|2|*|
    // |0|1|1|
    const game = initGame(3, 3, Point.of(1, 0), Point.of(2, 1))
    game.id = 999

    gameRepository.get = jest.fn(() => game)
    gameRepository.update = jest.fn((x) => x)

    //
    // テスト
    //
    const point = { x: 0, y: 2 }
    const response = await request(app).post('/api/games/999/opens').send(point)

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
    const game = initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    game.open(0, 0)
    gameRepository.get = jest.fn(() => game)
    gameRepository.update = jest.fn((x) => x)

    //
    // テスト
    //
    const point = { x: 0, y: 0 }
    const response = await request(app).post('/api/games/999/opens').send(point)

    //
    // 検証
    //
    expect(response.statusCode).toBe(200)
    expect(response.body.map(p => `${p.x}_${p.y}`).sort()).toEqual(['0_0'].sort())
  })
})

describe('DELETE /api/games/:gameId/opens/:id', () => {
  test('405 が返ること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    game.open(0, 0)

    gameRepository.get = jest.fn(() => game)
    gameRepository.update = jest.fn((x) => x)

    const response = await request(app).delete('/api/games/999/opens/0_0')

    expect(response.statusCode).toBe(405)
  })
})
