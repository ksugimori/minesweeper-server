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

    dbUtils.doTransaction(async connection => {
      const gameRepository = GameRepository.from(connection)

      const game = await gameRepository.get(gameId)

      const flags = game.field.points(cell => cell.isFlag)
      res.status(200).json(flags)
    }).catch(err => {
      next(err)
    })
  },

  /**
   * フラグを立てる。
   * @returns フラグを立てた座標
   */
  async create (req, res, next) {
    const gameId = req.params.gameId
    const point = req.body

    dbUtils.doTransaction(async connection => {
      const gameRepository = GameRepository.from(connection)
      const cellRepository = CellRepository.from(connection)

      const game = await gameRepository.get(gameId)

      game.flag(point.x, point.y)

      const updatedCells = game.field.all().filter(cell => cell.isChanged)

      if (Array.isArray(updatedCells) && updatedCells.length) {
        await cellRepository.createAll(game.id, updatedCells)
        res.status(201).json(point)
      } else {
        res.status(200).json(point)
      }
    }).catch(err => {
      next(err)
    })
  },

  /**
   * フラグを削除する。
   */
  async delete (req, res, next) {
    dbUtils.doTransaction(async connection => {
      const gameId = req.params.gameId
      const point = parseCellId(req.params.id)

      const gameRepository = GameRepository.from(connection)
      const cellRepository = CellRepository.from(connection)

      const game = await gameRepository.get(gameId)
      game.flag(point.x, point.y)

      const updated = game.field.all().filter(cell => cell.isChanged)
      await cellRepository.createAll(game.id, updated)

      res.status(204).end()
    }).catch(err => {
      next(err)
    })
  }
}

module.exports = FlagController
