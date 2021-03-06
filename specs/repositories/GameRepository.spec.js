const GameRepository = require('../../lib/repositories/GameRepository')
const Status = require('../../lib/models/status/Status')
const Point = require('../../lib/models/util/Point')
const mockUtils = require('../utils/mockUtils')

const gameRepository = new GameRepository()

/**
 * 未設定のプロパティに false を設定して Cell を補完する。
 * @param {Object} obj Cell
 * @returns フラグ類を補完した Cell の配列
 */
function fillFalse (obj) {
  return {
    x: obj.x,
    y: obj.y,
    isMine: !!obj.isMine,
    isOpen: !!obj.isOpen,
    isFlag: !!obj.isFlag
  }
}

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

    test('ステータスが保存されること', () => {
      // |*| | |
      // | |*| |
      const game = mockUtils.initGame(3, 2, Point.of(0, 0), Point.of(1, 1))

      game.open(1, 0)
      game.open(2, 0)

      const gameRepository = new GameRepository()

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
        width: 4,
        height: 3,
        numMines: 2,
        status: 'PLAY',
        cells: [
          { x: 0, y: 0, isMine: true }, { x: 1, y: 0, isOpen: true }, { x: 2, y: 0, isOpen: true },
          { x: 0, y: 1 }, { x: 1, y: 1, isMine: true, isFlag: true }, { x: 2, y: 1 }
        ].map(e => fillFalse(e)),
        startTime: new Date('2021-01-02T03:04:05.678')
      }

      const game = gameRepository.restore(record)

      expect(game.setting.width).toBe(4)
      expect(game.setting.height).toBe(3)
      expect(game.setting.numMines).toBe(2)
      expect(game.status).toBe(Status.PLAY)

      // 地雷
      expect(game.field.rows[0].map(e => e.isMine)).toEqual([true, false, false, false])
      expect(game.field.rows[1].map(e => e.isMine)).toEqual([false, true, false, false])
      expect(game.field.rows[2].map(e => e.isMine)).toEqual([false, false, false, false])

      // 開いてるセル
      expect(game.field.rows[0].map(e => e.isOpen)).toEqual([false, true, true, false])
      expect(game.field.rows[1].map(e => e.isOpen)).toEqual([false, false, false, false])
      expect(game.field.rows[2].map(e => e.isOpen)).toEqual([false, false, false, false])

      // フラグ
      expect(game.field.rows[0].map(e => e.isFlag)).toEqual([false, false, false, false])
      expect(game.field.rows[1].map(e => e.isFlag)).toEqual([false, true, false, false])
      expect(game.field.rows[2].map(e => e.isFlag)).toEqual([false, false, false, false])
    })

    test('復元して続きがプレイできること', () => {
      const game = gameRepository.restore({
        width: 2,
        height: 2,
        numMines: 2,
        cells: [
          { x: 0, y: 0, isMine: true }, { x: 1, y: 0, isOpen: true }, { x: 2, y: 0 },
          { x: 0, y: 1 }, { x: 1, y: 1, isMine: true }, { x: 2, y: 1 }
        ].map(e => fillFalse(e)),
        status: 'PLAY'
      })

      expect(game.status).toStrictEqual(Status.PLAY)

      game.open(0, 1)

      expect(game.status).toStrictEqual(Status.WIN)
    })
  })
})
