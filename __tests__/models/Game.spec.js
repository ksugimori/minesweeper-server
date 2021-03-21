const Game = require('../../models/Game.js')
const Status = require('../../models/status/Status.js')
const Point = require('../../models/util/Point.js')
const StopWatch = require('../../models/util/StopWatch.js')
const random = require('../../models/util/random')
jest.mock('../../models/util/StopWatch.js')

/**
 * Game のフィールドから全行を取り出し、mapFunc を適用して返す。
 * @param {Game} game game
 * @param {Function} mapFunc cell に対する mapping
 */
function extractRows (game, mapFunc) {
  return game.field.rows.map(row => row.map(mapFunc))
}

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

/**
 * 前処理
 */
beforeEach(() => {
  StopWatch.mockClear()
})

/**
 * テストケース
 */
describe('Game', () => {
  describe('#initialize', () => {
    test('行数、列数が引数で渡された値に一致すること', () => {
      const game = new Game()
      game.setting.merge({ width: 2, height: 3, numMines: 2 })
      game.initialize()

      expect(game.field.width).toBe(2) // 2列
      expect(game.field.height).toBe(3) // ３行
    })

    test('ステータスは INIT になること', () => {
      const game = new Game()
      game.setting.merge({ width: 2, height: 3, numMines: 2 })
      game.initialize()

      game.open(0, 0) // ここで PLAY になっている
      game.initialize() // 再度 initialize を呼ぶと INIT になっていること

      expect(game.status).toStrictEqual(Status.INIT)
    })

    test('すべてのセルが isOpen=false となっていること', () => {
      const game = new Game()
      game.setting.merge({ width: 3, height: 3, numMines: 2 })
      game.initialize()

      // 一箇所だけ開いておく
      game.open(0, 0)

      // initialize が呼ばれるとクリアされることを確認
      game.initialize()

      expect(extractRows(game, c => c.isOpen)).toEqual([
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ])
    })

    test('すべてのセルが isFlag=false となっていること', () => {
      const game = new Game()
      game.setting.merge({ width: 3, height: 3, numMines: 2 })
      game.initialize()

      // フラグを立てておくが、
      game.open(0, 0)
      game.flag(2, 2)

      // initialize が呼ばれるとクリアされることを確認
      game.initialize()

      expect(extractRows(game, cell => cell.isFlag)).toEqual([
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ])
    })

    test('closedCount がセル数と一致すること', () => {
      const game = new Game()

      game.setting.merge({ width: 4, height: 3, numMines: 10 })
      game.initialize()

      expect(game.closedCount).toBe(12)
    })

    test('地雷が指定した数だけ埋まっていること', () => {
      const game = new Game()

      // 9 * 9 = 81 マスのうち 10 個
      game.setting.merge({ width: 9, height: 9, numMines: 10 })
      game.initialize()
      game.open(0, 0)

      const count = game.field.rows.flat().filter(c => c.isMine).length

      expect(count).toBe(10)
    })

    test('ステータスが PLAY になっていること', () => {
      const game = new Game()

      game.setting.merge({ width: 9, height: 9, numMines: 10 })
      game.initialize()
      game.open(0, 0)

      expect(game.status).toStrictEqual(Status.PLAY)
    })
  })

  describe('#open', () => {
    test('指定したセルが数字の場合、そのセルの isOpen フラグが立つこと', () => {
      const game = initGame(2, 2, Point.of(1, 1))

      // テスト
      game.open(0, 0)

      // 検証
      expect(extractRows(game, c => c.isOpen)).toEqual([
        [true, false],
        [false, false]
      ])
    })

    test('指定したセルが空の場合、そのセルの周囲８セルに isOpen フラグが立つこと', () => {
      // 3行4列で、4列目に１つ地雷が埋まっている想定
      const game = initGame(3, 4, Point.of(1, 3))

      // この状態で (1, 1) を開くと、
      game.initialize()
      game.open(1, 1)

      // 周囲８セルも開かれること
      expect(extractRows(game, c => c.isOpen)).toEqual([
        [true, true, true],
        [true, true, true],
        [true, true, true],
        [false, false, false]
      ])
    })

    test('指定したセルが空の場合、そのセルの周囲８セルに isOpen フラグが立つが、isFlag=true となっているセルは変更されないこと', () => {
      // 3 行 5 列、4 行目に地雷がある
      const game = initGame(3, 5, Point.of(0, 3), Point.of(1, 3), Point.of(2, 3))

      game.open(0, 4) // はじめに１個開いたときに盤面が初期化されるのでクリアしない位置を開く

      game.flag(0, 0)
      game.open(1, 1)

      // 検証（左上は isOpen=false のまま）
      expect(extractRows(game, c => c.isOpen)).toEqual([
        [false, true, true],
        [true, true, true],
        [true, true, true],
        [false, false, false],
        [true, false, false]
      ])
    })

    test('指定したセルに地雷がある場合、ステータスが LOSE になること', () => {
      const game = initGame(2, 3, Point.of(0, 1), Point.of(1, 1))

      game.open(0, 0)

      // テスト実行
      game.open(1, 1)

      // ステータスは LOSE になること
      expect(game.status).toStrictEqual(Status.LOSE)
    })

    test('開いたセルの数だけ closedCount が減ること', () => {
      // 3行3列、2列目に地雷
      const game = initGame(3, 3, Point.of(1, 0), Point.of(1, 1), Point.of(1, 2))

      // この時点では全て閉じている
      expect(game.closedCount).toBe(9)

      // テスト実行
      game.open(0, 0)
      expect(game.closedCount).toBe(8)

      game.open(0, 1)
      expect(game.closedCount).toBe(7)

      game.open(0, 2)
      expect(game.closedCount).toBe(6)

      // のこりすべてを開く
      game.open(2, 0)
      game.open(2, 1)
      game.open(2, 2)

      expect(game.status).toStrictEqual(Status.WIN)
    })
  })

  describe('#flag', () => {
    test('選択したセルのフラグが立つこと', () => {
      // 3行3列、2列目に地雷
      const game = initGame(3, 3, Point.of(1, 0), Point.of(1, 1), Point.of(1, 2))

      game.open(0, 0)

      // この時点では 0 個
      expect(game.flagCount).toBe(0)

      game.flag(0, 1)
      expect(game.flagCount).toBe(1)

      game.flag(0, 2)
      expect(game.flagCount).toBe(2)

      // フラグがついたセルを再び呼ぶとフラグが外れること
      game.flag(0, 2)
      expect(game.flagCount).toBe(1)
    })

    test('ゲーム終了時はフラグが立てられないこと', () => {
      const game = initGame(2, 2, Point.of(0, 0))

      // 地雷以外を開く
      game.open(1, 0)
      game.open(0, 1)
      game.open(1, 1)

      // この時点で WIN
      expect(game.status).toStrictEqual(Status.WIN)
      expect(game.flagCount).toBe(0)

      // フラグを立てられないこと
      game.flag(0, 0)
      expect(game.flagCount).toBe(0)
    })
  })

  describe('#isWin', () => {
    test('地雷以外をすべて開いたら true を返すこと', () => {
      // |*| |
      // | |*|
      const game = initGame(2, 2, Point.of(0, 0), Point.of(1, 1))

      game.open(0, 1)
      expect(game.isWin()).toBeFalsy()

      game.open(1, 0)
      expect(game.isWin()).toBeTruthy()
    })

    // https://github.com/ksugimori/vue-minesweeper/issues/52
    test('最後に地雷を開いたら false を返すこと', () => {
      // |*| |
      // | |*|
      const game = initGame(2, 2, Point.of(0, 0), Point.of(1, 1))

      game.open(0, 1)
      expect(game.isWin()).toBeFalsy()

      game.open(0, 0) // 地雷を開く
      expect(game.isWin()).toBeFalsy()
    })
  })

  describe('#isLose', () => {
    test('地雷を開いたら true を返すこと', () => {
      // |*| |
      // | |*|
      const game = initGame(2, 2, Point.of(0, 0), Point.of(1, 1))

      game.open(0, 1)
      expect(game.isLose()).toBeFalsy()

      game.open(0, 0) // 地雷を開く
      expect(game.isLose()).toBeTruthy()
    })
  })

  describe('#save', () => {
    test('width, height が保存されること', () => {
      // |*| | |
      // | |*| |
      const game = initGame(3, 2, Point.of(0, 0), Point.of(1, 1))

      const data = game.save()

      expect(data.width).toBe(3)
      expect(data.height).toBe(2)
    })

    test('地雷、開いているセル、フラグの座標が保存されること', () => {
      // |*| | |
      // | |*| |
      const game = initGame(3, 2, Point.of(0, 0), Point.of(1, 1))

      game.open(1, 0)
      game.open(2, 0)

      game.flag(1, 1)

      // 保存
      const data = game.save()

      // 検証
      expect(JSON.parse(data.mines)).toContainEqual({ x: 0, y: 0 })
      expect(JSON.parse(data.mines)).toContainEqual({ x: 1, y: 1 })

      expect(JSON.parse(data.opens)).toContainEqual({ x: 1, y: 0 })
      expect(JSON.parse(data.opens)).toContainEqual({ x: 2, y: 0 })

      expect(JSON.parse(data.flags)).toContainEqual({ x: 1, y: 1 })
    })

    test('ステータスが保存されること', () => {
      // |*| | |
      // | |*| |
      const game = initGame(3, 2, Point.of(0, 0), Point.of(1, 1))

      game.open(1, 0)
      game.open(2, 0)

      // PLAY
      const playData = game.save()
      expect(playData.status).toEqual('PLAY')

      // LOSE
      game.open(0, 0)
      const loseData = game.save()
      expect(loseData.status).toEqual('LOSE')
    })

    test('開始時刻が保存されること', () => {
      // |*| | |
      // | |*| |
      const game = initGame(3, 2, Point.of(0, 0), Point.of(1, 1))
      game.stopWatch.startTime = 1234567890

      const data = game.save()

      expect(data.startTime).toStrictEqual(new Date(1234567890))
    })
  })

  describe('#restore', () => {
    test('復元できること', () => {
      const data = {
        width: 3,
        height: 2,
        status: 'PLAY',
        mines: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        opens: [{ x: 1, y: 0 }, { x: 2, y: 0 }],
        flags: [{ x: 1, y: 1 }],
        startTime: '2021-01-02T03:04:05.678'
      }

      const game = Game.restore(data)

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

      // 開始時刻（Game のコンストラクタ内で１回、restore で２回目が呼ばれる）
      const args = StopWatch.mock.instances[0].constructor.mock.calls[1]
      expect(args[0]).toBe(1609524245678)
    })

    test('復元して続きがプレイできること', () => {
      const game = Game.restore({
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
