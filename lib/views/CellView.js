/**
 * 「開いたセル」を表す View
 */
class CellView {
  /**
   * コンストラクタ
   * @param {Cell}} cell セル
   */
  constructor (cell) {
    this.cell = cell
  }

  /**
   * セルをラップしてインスタンスを作成する。
   * @param {Cell} cell セル
   * @returns セルをラップしたインスタンス
   */
  static wrap (cell) {
    return new CellView(cell)
  }

  /**
   * JSONとしてシリアライズする。
   * @returns JSONシリアライズ用のオブジェクト
   */
  toJSON () {
    return {
      x: this.cell.x,
      y: this.cell.y,
      count: this.cell.count
    }
  }
}

module.exports = CellView
