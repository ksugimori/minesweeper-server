const request = require('supertest')
const app = require('../../../app.js')
const Point = require('../../../lib/models/util/Point')
const gameRepository = require('../../../lib/repositories/gameRepository')
jest.mock('../../../lib/repositories/gameRepository')
const mockUtils = require('../../utils/mockUtils')

describe('GET /api/games/:gameId/status', () => {
  test('ステータスが取得できること', async () => {
    // |1|*|2|
    // |1|2|*|
    const game = mockUtils.initGame(3, 2, Point.of(1, 0), Point.of(2, 1))
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
