const gameRepository = require('../../lib/repositories/gameRepository')
const Status = require('../../lib/models/status/Status')
const Point = require('../../lib/models/util/Point')
const mockUtils = require('../utils/mockUtils')

describe('gameRepository', () => {
  describe('#toRecord', () => {
    test('width, height が保存されること', () => {
      // |*| | |
      // | |*| |
      const game = mockUtils.initGame(3, 2, Point.of(0, 0), Point.of(1, 1))

      const record = gameRepository.toRecord(game)

      expect(record.width).toBe(3)
      expect(record.height).toBe(2)
    })

    test('地雷、開いているセル、フラグの座標が保存されること', () => {
      // |*| | |
      // | |*| |
      const game = mockUtils.initGame(3, 2, Point.of(0, 0), Point.of(1, 1))

      game.open(1, 0)
      game.open(2, 0)

      game.flag(1, 1)

      // 保存
      const record = gameRepository.toRecord(game)

      // 検証
      expect(JSON.parse(record.mines)).toContainEqual({ x: 0, y: 0 })
      expect(JSON.parse(record.mines)).toContainEqual({ x: 1, y: 1 })

      expect(JSON.parse(record.opens)).toContainEqual({ x: 1, y: 0 })
      expect(JSON.parse(record.opens)).toContainEqual({ x: 2, y: 0 })

      expect(JSON.parse(record.flags)).toContainEqual({ x: 1, y: 1 })
    })

    test('ステータスが保存されること', () => {
      // |*| | |
      // | |*| |
      const game = mockUtils.initGame(3, 2, Point.of(0, 0), Point.of(1, 1))

      game.open(1, 0)
      game.open(2, 0)

      // PLAY
      const playData = gameRepository.toRecord(game)
      expect(playData.status).toEqual('PLAY')

      // LOSE
      game.open(0, 0)
      const loseData = gameRepository.toRecord(game)
      expect(loseData.status).toEqual('LOSE')
    })
  })

  describe('#restore', () => {
    test('復元できること', () => {
      const record = {
        width: 3,
        height: 2,
        status: 'PLAY',
        mines: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        opens: [{ x: 1, y: 0 }, { x: 2, y: 0 }],
        flags: [{ x: 1, y: 1 }],
        startTime: new Date('2021-01-02T03:04:05.678')
      }

      const game = gameRepository.restore(record)

      expect(game.setting.width).toBe(3)
      expect(game.setting.height).toBe(2)
      expect(game.setting.numMines).toBe(2)
      expect(game.status).toBe(Status.PLAY)

      // 地雷
      expect(game.field.rows[0].map(e => e.isMine)).toEqual([true, false, false])
      expect(game.field.rows[1].map(e => e.isMine)).toEqual([false, true, false])

      // 開いてるセル
      expect(game.field.rows[0].map(e => e.isOpen)).toEqual([false, true, true])
      expect(game.field.rows[1].map(e => e.isOpen)).toEqual([false, false, false])

      // フラグ
      expect(game.field.rows[0].map(e => e.isFlag)).toEqual([false, false, false])
      expect(game.field.rows[1].map(e => e.isFlag)).toEqual([false, true, false])
    })

    test('復元して続きがプレイできること', () => {
      const game = gameRepository.restore({
        width: 2,
        height: 2,
        mines: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        opens: [{ x: 1, y: 0 }],
        flags: [],
        status: 'PLAY'
      })

      expect(game.status).toStrictEqual(Status.PLAY)

      game.open(0, 1)

      expect(game.status).toStrictEqual(Status.WIN)
    })
  })
})
