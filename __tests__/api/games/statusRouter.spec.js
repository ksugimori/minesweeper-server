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

describe('GET /api/games/:gameId/status', () => {
  test('ステータスが取得できること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
    game.id = 999
    gameRepository.get = jest.fn(() => game)

    // ゲーム開始前
    let response = await request(app).get('/api/games/999/status')
    expect(response.body.status).toBe('INIT')

    // 開始
    game.open(0, 0)
    response = await request(app).get('/api/games/999/status')
    expect(response.body.status).toBe('PLAY')

    // 終了（負け）
    game.open(1, 0)
    response = await request(app).get('/api/games/999/status')
    expect(response.body.status).toBe('LOSE')
  })
})

describe('POST /api/games/:gameId/status', () => {
  test('禁止されていること', async () => {
    const response = await request(app).post('/api/games/999/status')
    expect(response.statusCode).toBe(405)
  })
})

describe('PUT /api/games/:gameId/status', () => {
  test('禁止されていること', async () => {
    const response = await request(app).put('/api/games/999/status')
    expect(response.statusCode).toBe(405)
  })
})

describe('DELETE /api/games/:gameId/status', () => {
  test('禁止されていること', async () => {
    const response = await request(app).delete('/api/games/999/status')
    expect(response.statusCode).toBe(405)
  })
})
