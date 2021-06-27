/**
 * クライアントに返却する 「開いたセル」
 *
 * 出力するプロパティの制御などはこのクラスで行います。
 */
class OpenCellView {
  constructor (cell) {
    this.cell = cell
  }

  /**
   * Cell オブジェクトから OpenCellView を作成する
   * @param {Cell} cell セル
   * @returns OpenCellView
   */
  static wrap (cell) {
    return new OpenCellView(cell)
  }

  /**
   * クライアントに渡すためにJSONとしてシリアライズする。
   */
  toJSON () {
    return {
      x: this.cell.x,
      y: this.cell.y,
      count: this.cell.count
    }
  }
}

module.exports = OpenCellView
