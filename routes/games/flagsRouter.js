const flagController = require('../../lib/controllers/flagController')

/**
 * flags へのルーティングを設定する。
 * @param {Router} router games に対するルータ
 */
exports.route = function (router) {
  /**
   * フラグ一覧の取得
   */
  router.get('/:gameId/flags', async function (req, res, next) {
    try {
      const flags = await flagController.get(req.params.gameId)
      res.status(200).json(flags)
    } catch (err) {
      next(err)
    }
  })

  /**
   * フラグを作成する
   */
  router.post('/:gameId/flags', async function (req, res, next) {
    try {
      const point = await flagController.create(req.params.gameId, req.body)

      if (point) {
        res.status(201).json(point)
      } else {
        res.status(204).end()
      }
    } catch (err) {
      next(err)
    }
  })

  /**
   * フラグを削除する
   */
  router.delete('/:gameId/flags/:id', async function (req, res, next) {
    try {
      await flagController.delete(req.params.gameId, req.params.id)
      res.status(204).end()
    } catch (err) {
      next(err)
    }
  })
}
