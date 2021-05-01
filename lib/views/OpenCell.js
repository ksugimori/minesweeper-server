/**
 * 「開いたセル」を表す View
 */
class OpenCell {
  /**
   * コンストラクタ
   * @param {Cell}} value セル
   */
  constructor (value) {
    this.value = value
  }

  /**
   * セルをラップしてインスタンスを作成する。
   * @param {Cell} value セル
   * @returns セルをラップしたインスタンス
   */
  static wrap (value) {
    return new OpenCell(value)
  }

  /**
   * JSONとしてシリアライズする。
   * @returns JSONシリアライズ用のオブジェクト
   */
  toJSON () {
    return {
      count: this.value.count
    }
  }
}

module.exports = OpenCell
