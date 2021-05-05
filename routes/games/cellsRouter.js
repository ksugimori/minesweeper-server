const gameRepository = require('../../lib/repositories/gameRepository')

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
      const game = await gameRepository.get(req.params.gameId)
      const result = game.field.all().filter(cell => cell.isOpen)

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
      const game = await gameRepository.get(req.params.gameId)
      const point = { x: req.body.x, y: req.body.y }

      game.open(point.x, point.y)
      const updated = await gameRepository.update(game)

      const openCells = updated.field.all().filter(cell => cell.isOpen)
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
