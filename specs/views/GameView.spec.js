const Game = require('../../lib/models/Game.js')
const Point = require('../../lib/models/util/Point.js')
const random = require('../../lib/models/util/random')
const GameView = require('../../lib/views/GameView.js')

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

describe('GameView', () => {
  describe('#toJSON', () => {
    test('setting から width, height, numMines が反映されること', () => {
      const game = initGame(2, 3, Point.of(0, 0), Point.of(0, 1), Point.of(1, 0), Point.of(1, 1))

      const view = GameView.wrap(game)

      const json = JSON.stringify(view)
      const result = JSON.parse(json)
      expect(result.width).toBe(2)
      expect(result.height).toBe(3)
      expect(result.numMines).toBe(4)
    })

    test('status が文字列として反映されること', () => {
      const game = initGame(2, 3, Point.of(0, 0), Point.of(1, 1))

      // この時点では INIT
      const view = GameView.wrap(game)
      let json = JSON.stringify(view)
      let result = JSON.parse(json)
      expect(result.status).toBe('INIT')

      // ひとつでも開けば PLAY
      game.open(1, 0)
      json = JSON.stringify(view)
      result = JSON.parse(json)
      expect(result.status).toBe('PLAY')
    })

    test('startTime がISO8601フォーマットの文字列として反映されること', () => {
      const game = initGame(2, 3, Point.of(0, 0), Point.of(1, 1))

      const view = GameView.wrap(game)
      game.open(1, 0)

      const json = JSON.stringify(view)
      const result = JSON.parse(json)
      expect(result.startTime).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/)
    })

    test('開いているセル一覧が取得できること', () => {
      // |*|2|1|
      // |2|*|1|
      const game = initGame(3, 2, Point.of(0, 0), Point.of(1, 1))

      const view = GameView.wrap(game)
      game.open(0, 1)
      game.open(2, 0)

      const json = JSON.stringify(view)
      const result = JSON.parse(json).openCells.sort()
      expect(result).toEqual([
        { x: 0, y: 1, count: 2 },
        { x: 2, y: 0, count: 1 }
      ].sort())
    })

    test('フラグ一覧がセットされていること', () => {
      // |*|2|1|
      // |2|*|1|
      const game = initGame(3, 2, Point.of(0, 0), Point.of(1, 1))

      const view = GameView.wrap(game)
      game.open(0, 1)
      game.flag(0, 0)

      const json = JSON.stringify(view)
      const result = JSON.parse(json)
      expect(result.flags.sort()).toEqual([
        { x: 0, y: 0 }
      ])
    })

    test('セル一覧の中でオープンしたセルには count がセットされていること', () => {
      // |*|2|1|
      // |2|*|1|
      const game = initGame(3, 2, Point.of(0, 0), Point.of(1, 1))

      const view = GameView.wrap(game)
      game.open(1, 0)
      game.open(2, 0)

      const json = JSON.stringify(view)
      const result = JSON.parse(json).cells.map(arr => arr.map(e => e.count))
      expect(result).toEqual([
        [0, 2, 1],
        [0, 0, 0]
      ])
    })

    test('プレイ中は isMine が全て false, 終了後は地雷のある場所に true がセットされていること', () => {
      // |*|2|1|
      // |2|*|1|
      const game = initGame(3, 2, Point.of(0, 0), Point.of(1, 1))

      const view = GameView.wrap(game)
      game.open(0, 1)

      // この時点ではすべて false
      const json1 = JSON.stringify(view)
      const result1 = JSON.parse(json1).cells.map(arr => arr.map(e => e.isMine))
      expect(result1).toEqual([
        [false, false, false],
        [false, false, false]
      ])

      // 地雷を開いてゲームオーバーになると全て開く
      game.open(0, 0)

      const json2 = JSON.stringify(view)
      const result2 = JSON.parse(json2).cells.map(arr => arr.map(e => e.isMine))
      expect(result2).toEqual([
        [true, false, false],
        [false, true, false]
      ])
    })
  })
})
