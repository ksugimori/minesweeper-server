const gameRepository = require('../repositories/gameRepository')
const flagRepository = require('../repositories/flagRepository')
const Cell = require('../models/Cell')
const BadRequestException = require('../exceptions/BadRequestException')

/**
 * セルIDをパースして Point 型のインスタンスを返す。
 * @param {String} id セルID
 * @returns point
 */
function parseCellId (id) {
  try {
    return Cell.parseId(id)
  } catch (err) {
    console.error(`invalid ID: ${id}`)
    throw new BadRequestException('IDが不正です')
  }
}

const FlagController = {
  /**
   * フラグの一覧を取得する。
   * @returns フラグの立っている座標のリスト
   */
  async get (req, res, next) {
    try {
      const game = await gameRepository.get(req.params.gameId)
      const flags = game.field.points(cell => cell.isFlag)
      res.status(200).json(flags)
    } catch (err) {
      next(err)
    }
  },

  /**
   * フラグを立てる。
   * @returns フラグを立てた座標
   */
  async create (req, res, next) {
    const gameId = req.params.gameId
    const point = req.body

    try {
      const game = await gameRepository.get(gameId)

      if (game.field.cellAt(point).isFlag) {
        res.status(204).end()
        return
      }

      game.flag(point.x, point.y)

      if (game.field.cellAt(point).isFlag) {
        await flagRepository.create(gameId, point)
      }

      res.status(201).json(point)
    } catch (err) {
      next(err)
    }
  },

  /**
   * フラグを削除する。
   */
  async delete (req, res, next) {
    try {
      const gameId = req.params.gameId
      const point = parseCellId(req.params.id)

      const game = await gameRepository.get(gameId)

      const cell = game.field.cellAt(point)
      if (cell.isFlag) {
        cell.unflag()
      }

      await flagRepository.delete(gameId, point)

      res.status(204).end()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = FlagController
