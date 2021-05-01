const gameRepository = require('../../lib/repositories/gameRepository')
const Point = require('../../lib/models/util/Point')
const BadRequestException = require('../../lib/exceptions/BadRequestException')

/**
 * セルIDをパースして Point 型のインスタンスを返す。
 * @param {String} id セルID
 * @returns point
 */
function parseCellId (id) {
  try {
    return Point.parseId(id)
  } catch (err) {
    console.error(`invalid ID: ${id}`)
    throw new BadRequestException('IDが不正です')
  }
}

/**
 * flags へのルーティングを設定する。
 * @param {Router} router games に対するルータ
 */
exports.route = function (router) {
  /**
   * フラグ一覧の取得
   */
  router.get('/:gameId/cells/flag', async function (req, res, next) {
    try {
      const game = await gameRepository.get(req.params.gameId)
      const flags = game.field.points(cell => cell.isFlag)
      res.status(200).json(flags)
    } catch (err) {
      next(err)
    }
  })

  /**
   * フラグを作成する
   */
  router.post('/:gameId/cells/flag', async function (req, res, next) {
    try {
      const game = await gameRepository.get(req.params.gameId)
      const point = { x: req.body.x, y: req.body.y }

      if (game.field.cellAt(point).isFlag) {
        res.status(204).end()
        return
      }

      game.flag(point.x, point.y)
      await gameRepository.update(game)

      res.status(201).json(point)
    } catch (err) {
      next(err)
    }
  })

  /**
   * フラグを削除する
   */
  router.delete('/:gameId/cells/flag/:id', async function (req, res, next) {
    try {
      const { gameId, id } = req.params

      const point = parseCellId(id)
      const game = await gameRepository.get(gameId)

      const cell = game.field.cellAt(point)
      if (cell.isFlag) {
        cell.unflag()
      }

      await gameRepository.update(game)

      res.status(204).end()
    } catch (err) {
      next(err)
    }
  })
}
