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

    this._count = 0
    this._isMine = false
    this._isOpen = false
    this._isFlag = false

    this.isChanged = false
  }

  static of (obj) {
    const instance = new Cell(obj)

    instance._count = obj.count
    instance._isMine = obj.isMine
    instance._isOpen = obj.isOpen
    instance._isFlag = obj.isFlag

    instance.isChanged = false

    return instance
  }

  /**
   * インスタンスのコピーを作成する。
   * @returns Cell
   */
  clone () {
    const result = new Cell({ x: this.x, y: this.y })

    result._count = this.count
    result._isOpen = this.isOpen
    result._isMine = this.isMine
    result._isFlag = this.isFlag

    result.isChanged = false

    return result
  }

  /**
   * 周囲の地雷数
   */
  get count () {
    return this._count
  }

  /**
   * 周囲の地雷数をセット
   */
  set count (value) {
    if (this._count === value) {
      return
    }

    this._count = value
    this.isChanged = true
  }

  /**
   * 地雷がセットされているか？
   */
  get isMine () {
    return this._isMine
  }

  set isMine (value) {
    if (this._isMine === value) {
      return
    }

    this._isMine = value
    this.isChanged = true
  }

  /**
   * フラグが立っているか？
   */
  get isFlag () {
    return this._isFlag
  }

  set isFlag (value) {
    if (this._isFlag === value) {
      return
    }

    this._isFlag = value
    this.isChanged = true
  }

  /**
   * 開いているか？
   */
  get isOpen () {
    return this._isOpen
  }

  set isOpen (value) {
    if (this._isOpen === value) {
      return
    }

    this._isOpen = value
    this.isChanged = true
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

  /**
   * JSON としてシリアライズする。
   * @returns シリアライズ用のオブジェクト
   */
  toJSON () {
    return {
      x: this.x,
      y: this.y,
      count: this.count,
      isMine: this.isMine,
      isFlag: this.isFlag,
      isOpen: this.isOpen
    }
  }

  reset () {
    this.isChanged = false
  }
}

module.exports = Cell
