const gameRepository = require('../repositories/gameRepository')
const Cell = require('../../lib/models/Cell')
const BadRequestException = require('../../lib/exceptions/BadRequestException')

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
   * @param {String} gameId Game の ID
   * @returns フラグの立っている座標のリスト
   */
  async get (gameId) {
    const game = await gameRepository.get(gameId)
    return game.field.points(cell => cell.isFlag)
  },

  /**
   * フラグを立てる。
   * @param {String} gameId Game の ID
   * @param {Object} point 座標
   * @returns フラグを立てた座標
   */
  async create (gameId, point) {
    const game = await gameRepository.get(gameId)

    if (game.field.cellAt(point).isFlag) {
      return null
    }

    game.flag(point.x, point.y)
    await gameRepository.update(game)

    return point
  },

  /**
   * フラグを削除する。
   * @param {String} gameId Game の ID
   * @param {String} id セルのID
   */
  async delete (gameId, id) {
    const point = parseCellId(id)
    const game = await gameRepository.get(gameId)

    const cell = game.field.cellAt(point)
    if (cell.isFlag) {
      cell.unflag()
    }

    await gameRepository.update(game)
  }
}

module.exports = FlagController
