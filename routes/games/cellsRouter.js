const gameRepository = require('../../lib/repositories/gameRepository')

/**
 * open-cells へのルーティングを設定する。
 * @param {Router} router games に対するルータ
 */
exports.route = function (router) {
  /**
   * 開いたセル一覧の取得
   */
  router.get('/:gameId/cells/open', async function (req, res, next) {
    try {
      const game = await gameRepository.get(req.params.gameId)
      const openCells = game.field.points(cell => cell.isOpen)
      res.status(200).json(openCells)
    } catch (err) {
      next(err)
    }
  })

  /**
   * セルを開く（開いたセルを作る）
   */
  router.post('/:gameId/cells/open', async function (req, res, next) {
    try {
      const game = await gameRepository.get(req.params.gameId)
      const point = { x: req.body.x, y: req.body.y }

      if (game.field.cellAt(point).isOpen) {
        const openCells = game.field.points(cell => cell.isOpen)
        res.status(200).json(openCells)
        return
      }

      game.open(point.x, point.y)
      await gameRepository.update(game)

      const openCells = game.field.points(cell => cell.isOpen)
      res.status(201).json(openCells)
    } catch (err) {
      next(err)
    }
  })

  /**
   * 開いたセルを閉じる
   */
  router.delete('/:gameId/cells/open/:id', async function (req, res, next) {
    res.status(405).end()
  })
}
