const openCellController = require('../../lib/controllers/openCellController')

/**
 * open-cells へのルーティングを設定する。
 * @param {Router} router games に対するルータ
 */
exports.route = function (router) {
  /**
   * 開いたセル一覧の取得
   */
  router.get('/:gameId/open-cells', async function (req, res, next) {
    try {
      const result = await openCellController.get(req.params.gameId)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  })

  /**
   * セルを開く（開いたセルを作る）
   */
  router.post('/:gameId/open-cells', async function (req, res, next) {
    try {
      const openCells = await openCellController.create(req.params.gameId, req.body)
      res.status(201).json(openCells)
    } catch (err) {
      next(err)
    }
  })

  /**
   * 開いたセルを閉じる
   */
  router.delete('/:gameId/open-cells/:id', async function (req, res, next) {
    res.status(405).end()
  })
}
