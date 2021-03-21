const Point = require('./util/Point.js')
const Status = require('./status/Status.js')
const Field = require('./Field.js')
const StopWatch = require('./util/StopWatch.js')
const Setting = require('./Setting.js')
const UniqueQueue = require('./util/UniqueQueue.js')
const random = require('./util/random.js')

/**
 * マインスイーパー全体を管理するクラス
 */
class Game {
  /**
   * コンストラクタ
   */
  constructor () {
    this.field = new Field()
    this.stopWatch = new StopWatch()
    this.setting = Setting.EASY
    this.status = Status.INIT
  }

  /**
   * フラグの数
   */
  get flagCount () {
    return this.field.points(cell => cell.isFlag).length
  }

  /**
   * 閉じているセルの数
   */
  get closedCount () {
    return this.field.points(cell => !cell.isOpen).length
  }

  /**
   * ミスしたセル数（地雷なのに開いてしまったセルの数）
   */
  get missCount () {
    return this.field.points(cell => cell.isMine && cell.isOpen).length
  }

  /**
   * プレイ時間
   */
  get playTime () {
    return this.stopWatch.playTime
  }

  /**
   * タイマー計測を開始する
   */
  timerStart () {
    this.stopWatch.start()
  }

  /**
   * タイマー計測を停止する
   */
  timerStop () {
    this.stopWatch.stop()
  }

  /**
   * 勝利状態か？
   */
  isWin () {
    return this.missCount === 0 && this.closedCount === this.setting.numMines
  }

  /**
   * 敗北状態か？
   */
  isLose () {
    return this.missCount > 0
  }

  /**
   * 盤面を初期化する。
   */
  initialize () {
    this.field = new Field(this.setting.width, this.setting.height)

    this.stopWatch.reset()
    this.status = Status.INIT
  }

  /**
   * 地雷を配置する。
   *
   * 初手アウトを防ぐため、引数で渡された場所には配置しない。
   * @param {Point} exclude 除外する座標
   */
  mine (exclude) {
    // 地雷をランダムにセット
    random.points(this.setting, exclude).forEach(p => this.field.cellAt(p).mine())

    // 各マスの周囲の地雷数をカウントし、value にセットする。
    this.field.points().forEach(p => {
      const cell = this.field.cellAt(p)
      if (!cell.isMine) {
        cell.count = this.field.pointsArround(p, c => c.isMine).length
      }
    })
  }

  /**
   * セルを開く
   * @param {Number} x x座標
   * @param {Number} y y座標
   */
  open (x, y) {
    this.status.open(this, Point.of(x, y))
  }

  /**
   * 指定したセルを開く。
   *
   * @param {Point} point 座標
   */
  doOpen (point) {
    const cell = this.field.cellAt(point)

    if (cell.isFlag) {
      return
    }

    if (cell.isOpen) {
      const arroundFlagCount = this.field.pointsArround(point, c => c.isFlag).length

      if (cell.count === arroundFlagCount) {
        this.openRecursive(point)
      }
    } else {
      cell.open()

      if (cell.isEmpty) {
        this.openRecursive(point)
      }
    }
  }

  /**
   * フラグをつける。
   * @param {Number} x x座標
   * @param {Number} y y座標
   */
  flag (x, y) {
    this.status.flag(this, Point.of(x, y))
  }

  /**
   * フラグをつける。
   * @param {Point} point 座標
   */
  doFlag (point) {
    const cell = this.field.cellAt(point)
    if (cell.isFlag) {
      cell.unflag()
    } else {
      cell.flag()
    }
  }

  /**
   * 周囲のセルを再帰的に開く。
   *
   * 数字、フラグ付きセルに到達したらそこで終了します。
   * @param {Point} point 座標
   */
  openRecursive (point) {
    // 開けるセルであるか？
    const canOpen = (cell) => !cell.isOpen && !cell.isFlag

    const queue = new UniqueQueue()
    this.field.pointsArround(point, canOpen).forEach(p => queue.push(p))

    let target
    while ((target = queue.shift()) !== undefined) {
      const cell = this.field.cellAt(target)

      cell.open()

      // 開いたセルが空白なら、その周囲を再帰的に開く
      if (cell.isEmpty) {
        this.field.pointsArround(target, canOpen).forEach(p => queue.push(p))
      }
    }
  }

  /**
   * 保存用のオブジェクトを出力する。
   */
  save () {
    const serializePointArray = function (points) {
      return JSON.stringify(points.map(p => ({ x: p.x, y: p.y })))
    }

    return {
      width: this.setting.width,
      height: this.setting.height,
      numMines: this.setting.numMines,
      startTime: this.stopWatch.startTime && new Date(this.stopWatch.startTime),
      status: this.status.name,
      mines: serializePointArray(this.field.points(cell => cell.isMine)),
      opens: serializePointArray(this.field.points(cell => cell.isOpen)),
      flags: serializePointArray(this.field.points(cell => cell.isFlag))
    }
  }

  /**
   * 保存用のオブジェクトから元の状態を復元する。
   * @param {Object} data save メソッドで出力されたデータ
   */
  static restore (data) {
    const instance = new Game()

    instance.setting.width = data.width
    instance.setting.height = data.height
    instance.stopWatch = new StopWatch(new Date(data.startTime).getTime())
    instance.status = Status.parse(data.status)

    instance.field = new Field(data.width, data.height)

    data.mines.forEach(p => instance.field.cellAt(p).mine())
    data.opens.forEach(p => instance.field.cellAt(p).open())
    data.flags.forEach(p => instance.field.cellAt(p).flag())

    // 各マスの周囲の地雷数をカウントし、value にセットする。
    instance.field.points().forEach(p => {
      const cell = instance.field.cellAt(p)
      if (!cell.isMine) {
        cell.count = instance.field.pointsArround(p, c => c.isMine).length
      }
    })

    return instance
  }
}

module.exports = Game
