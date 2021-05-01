/**
 * 「開いたセル」を表す View
 */
class CellView {
  /**
   * コンストラクタ
   * @param {Point} point 座標
   * @param {Cell}} cell セル
   */
  constructor (point, cell) {
    this.point = point
    this.cell = cell
  }

  /**
   * セルをラップしてインスタンスを作成する。
   * @param {Point} point 座標
   * @param {Cell} cell セル
   * @returns セルをラップしたインスタンス
   */
  static wrap (point, cell) {
    return new CellView(point, cell)
  }

  /**
   * JSONとしてシリアライズする。
   * @returns JSONシリアライズ用のオブジェクト
   */
  toJSON () {
    return {
      x: this.point.x,
      y: this.point.y,
      count: this.cell.count
    }
  }
}

module.exports = CellView
