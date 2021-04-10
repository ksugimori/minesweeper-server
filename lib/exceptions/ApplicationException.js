/**
 * アプリケーション例外
 */
class ApplicationException {
  /**
   * コンストラクタ
   * @param {String} message エラーメッセージ
   */
  constructor (message) {
    this.message = message
  }

  /**
   * レスポンスとして返却するステータスコード
   */
  get statusCode () {
    throw new Error('statusCode is not implemented!!')
  }
}

module.exports = ApplicationException
