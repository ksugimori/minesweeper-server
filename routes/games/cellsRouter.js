const gameRepository = require('../../lib/repositories/gameRepository')
const CellView = require('../../lib/views/CellView')

function extractOpenCells (game) {
  return game.field.points(cell => cell.isOpen)
    .map(p => new CellView(p, game.field.cellAt(p)))
}

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

      const result = extractOpenCells(game)

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

      if (updated.status.isEnd) {
        const gamePath = `/api/games/${updated.id}`
        res.status(303).location(gamePath).end()
      } else {
        const openCells = extractOpenCells(updated)
        res.status(201).json(openCells)
      }
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
