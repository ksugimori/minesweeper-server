const ApplicationException = require('./ApplicationException')

/**
 * アプリケーション例外のハンドラー。
 * @param {Object} err エラー
 * @param {Request} req リクエスト
 * @param {Response} res レスポンス
 * @param {Function} next
 */
function exceptionHandler (err, req, res, next) {
  if (err instanceof ApplicationException) {
    res.status(err.statusCode).json({ message: err.message })
  } else {
    next(err)
  }
}

module.exports = exceptionHandler
