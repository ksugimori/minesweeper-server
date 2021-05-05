const Point = require('./util/Point')

/**
 * セル
 */
class Cell {
  /**
   * コンストラクタ
   * @param {Point} point 座標
   */
  constructor (point) {
    this.x = point.x
    this.y = point.y

    this.count = 0
    this.isOpen = false
    this.isMine = false
    this.isFlag = false
  }

  /**
   * インスタンスのコピーを作成する。
   * @returns Cell
   */
  clone () {
    const result = new Cell({ x: this.x, y: this.y })

    result.count = this.count
    result.isOpen = this.isOpen
    result.isMine = this.isMine
    result.isFlag = this.isFlag

    return result
  }

  /**
   * 数字文字列
   */
  get countString () {
    return this.isEmpty ? '' : this.count.toString()
  }

  /**
   * 空のセルであるか？
   */
  get isEmpty () {
    return this.count === 0 && !this.isMine
  }

  /**
   * ミスしたセルか？
   *
   * 以下いずれかに当てはまる場合は true を返します
   * ・地雷なのに開いてしまった
   * ・フラグを立てたのに地雷じゃなかった
   */
  get isMiss () {
    if (!this.isMine && this.isFlag) {
      return true
    }

    if (this.isMine && this.isOpen) {
      return true
    }

    return false
  }

  /**
   * セルのID
   */
  get id () {
    return Point.of(this.x, this.y).id
  }

  /**
   * IDをパースして Cell オブジェクトを作成する
   * @param {String} idString ID文字列
   * @returns セル
   */
  static parseId (idString) {
    const p = Point.parseId(idString)
    return new Cell(p)
  }

  /**
   * セルを開く
   */
  open () {
    this.isOpen = true
  }

  /**
   * 地雷をセットする
   */
  mine () {
    this.isMine = true
  }

  /**
   * フラグを立てる
   */
  flag () {
    if (this.isOpen) return

    this.isFlag = true
  }

  /**
   * フラグを外す
   */
  unflag () {
    this.isFlag = false
  }
}

module.exports = Cell
