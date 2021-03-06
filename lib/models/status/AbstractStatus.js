/**
 * ゲームの状態
 */
class AbstractStatus {
  constructor (name) {
    this.name = name
  }

  /**
   * DB保存用にシリアライズする
   */
  toRecord () {
    return this.name
  }

  /**
   * JSON用にシリアライズする
   */
  toJSON () {
    return this.name
  }

  /**
   * 終了状態か？
   */
  get isEnd () {
    throw new Error('Method Unimplemented! isEnd()')
  }

  /**
   * 指定した座標のセルを開く。
   * @param {Game} game ゲーム
   * @param {Point} point 座標
   */
  open (game, point) {
    throw new Error(`Method Unimplemented! open(${game}, ${point})`)
  }

  /**
   * 指定した座標のセルにフラグを立てる。
   * @param {Game} game ゲーム
   * @param {Point} point 座標
   */
  flag (game, point) {
    throw new Error(`Method Unimplemented! flag(${game}, ${point}`)
  }
}

AbstractStatus.ENUM = { }

module.exports = AbstractStatus
