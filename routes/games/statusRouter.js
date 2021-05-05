const gameController = require('../../lib/controllers/gameController')

/**
 * status へのルーティングを設定する。
 * @param {Router} router games に対するルータ
 */
exports.route = function (router) {
  /**
   * ステータスの取得
   */
  router.get('/:gameId/status', async function (req, res, next) {
    try {
      const status = await gameController.getStatus(req.params.gameId)
      res.status(200).json({ status })
    } catch (err) {
      next(err)
    }
  })

  router.post('/:gameId/status', function (req, res) {
    res.status(405).end()
  })

  router.put('/:gameId/status', function (req, res) {
    res.status(405).end()
  })

  router.delete('/:gameId/status', function (req, res) {
    res.status(405).end()
  })
}
