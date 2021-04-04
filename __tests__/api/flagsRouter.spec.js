const request = require('supertest')
const app = require('../../app.js')
const Game = require('../../models/Game')
const random = require('../../models/util/random')
const Point = require('../../models/util/Point')
const gameRepository = require('../../repositories/gameRepository')
jest.mock('../../repositories/gameRepository')

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

describe('GET /api/games/:gameId/flags', () => {
  test('フラグの一覧が取得できること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    game.open(0, 0)

    game.flag(2, 0)
    game.flag(1, 1)

    gameRepository.get = jest.fn(() => game)

    // API コール
    const response = await request(app).get('/api/games/999/flags')

    expect(response.body).toEqual([{ x: 1, y: 1 }, { x: 2, y: 0 }])
  })
})

describe('POST /api/games/:gameId/flags', () => {
  test('フラグが追加できること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    game.open(0, 0)
    gameRepository.get = jest.fn(() => game)
    gameRepository.update = jest.fn((x) => x)

    const point = { x: 1, y: 0 }
    const response = await request(app).post('/api/games/999/flags').send(point)

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({ x: 1, y: 0 })

    expect(game.field.cellAt(point).isFlag).toBeTruthy()
  })

  test('すでにフラグが存在する場合は 204 が返却されること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    game.open(0, 0)
    game.flag(1, 0)
    gameRepository.get = jest.fn(() => game)
    gameRepository.update = jest.fn((x) => x)

    const point = { x: 1, y: 0 }
    const response = await request(app).post('/api/games/999/flags').send(point)

    expect(response.statusCode).toBe(204)

    expect(game.field.cellAt(point).isFlag).toBeTruthy()
  })
})

describe('DELETE /api/games/:gameId/flags/:id', () => {
  test('フラグが外されること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    game.open(0, 0)

    game.flag(1, 0)

    gameRepository.get = jest.fn(() => game)
    gameRepository.update = jest.fn((x) => x)

    const response = await request(app).delete('/api/games/999/flags/1_0')

    expect(response.statusCode).toBe(204)

    expect(game.field.cellAt(Point.of(1, 0)).isFlag).toBeFalsy()
  })
})
