const gameRepository = require('../../repositories/gameRepository')
const Point = require('../../models/util/Point')

/**
 * flags へのルーティングを設定する。
 * @param {Router} router games に対するルータ
 */
exports.route = function (router) {
  /**
   * フラグ一覧の取得
   */
  router.get('/:gameId/flags', async function (req, res) {
    const game = await gameRepository.get(req.params.gameId)

    if (game) {
      const flags = game.field.points(cell => cell.isFlag)
      res.status(200).json(flags)
    } else {
      res.status(404).end()
    }
  })

  /**
   * フラグを作成する
   */
  router.post('/:gameId/flags', async function (req, res) {
    const game = await gameRepository.get(req.params.gameId)

    if (game) {
      const point = { x: req.body.x, y: req.body.y }

      if (game.field.cellAt(point).isFlag) {
        res.status(204).end()
        return
      }

      game.flag(point.x, point.y)
      await gameRepository.update(game)

      res.status(201).json(point)
    } else {
      res.status(404).end()
    }
  })

  /**
   * フラグを削除する
   */
  router.delete('/:gameId/flags/:id', async function (req, res) {
    const point = Point.parseId(req.params.id)
    const game = await gameRepository.get(req.params.gameId)

    if (game) {
      const cell = game.field.cellAt(point)
      if (cell.isFlag) {
        cell.unflag()
      }

      await gameRepository.update(game)

      res.status(204).end()
    } else {
      res.status(404).end()
    }
  })
}
