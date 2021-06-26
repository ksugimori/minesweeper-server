const Point = require('./util/Point.js')
const Status = require('./status/Status.js')
const Field = require('./Field.js')
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
    this.startTime = null
    this.endTime = null
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
    if (this.endTime) {
      return (this.endTime - this.startTime) / 1000
    } else if (this.startTime) {
      return (Date.now() - this.startTime) / 1000
    } else {
      return 0
    }
  }

  /**
   * タイマー計測を開始する
   */
  timerStart () {
    this.startTime = new Date()
  }

  /**
   * タイマー計測を停止する
   */
  timerStop () {
    this.endTime = new Date()
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

    this.startTime = null
    this.endTime = null
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
}

module.exports = Game
