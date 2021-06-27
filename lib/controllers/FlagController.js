const dbUtils = require('../db/dbUtils.js')
const GameRepository = require('../repositories/GameRepository')
const CellRepository = require('../repositories/CellRepository')
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
    const gameId = req.params.gameId

    dbUtils
      .doTransaction(async connection => {
        const game = await GameRepository.use(connection).get(gameId)
        return game.field.points(cell => cell.isFlag)
      })
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  },

  /**
   * フラグを立てる。
   * @returns フラグを立てた座標
   */
  async create (req, res, next) {
    const gameId = req.params.gameId
    const point = req.body

    dbUtils
      .doTransaction(async connection => {
        const game = await GameRepository.use(connection).get(gameId)

        game.flag(point.x, point.y)

        const updatedCells = game.field.all().filter(cell => cell.isChanged)

        if (updatedCells.length > 0) {
          await CellRepository.use(connection).upsertAll(game.id, updatedCells)
          return point
        } else {
          return null
        }
      })
      .then(result => res.status(result ? 201 : 200).json(result))
      .catch(err => next(err))
  },

  /**
   * フラグを削除する。
   */
  async delete (req, res, next) {
    const gameId = req.params.gameId
    const idString = req.params.id

    dbUtils
      .doTransaction(async connection => {
        const point = parseCellId(idString)

        const game = await GameRepository.use(connection).get(gameId)
        game.flag(point.x, point.y)

        const updatedCells = game.field.all().filter(cell => cell.isChanged)
        await CellRepository.use(connection).upsertAll(game.id, updatedCells)
      })
      .then(() => res.status(204).end())
      .catch(err => next(err))
  }
}

module.exports = FlagController
