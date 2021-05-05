const gameRepository = require('../repositories/gameRepository')

const OpenCellController = {
  /**
   * 開いているセルのリストを取得する。
   * @param {String} gameId Game の ID
   * @returns 開いているセルのリスト
   */
  async get (gameId) {
    const game = await gameRepository.get(gameId)
    return game.field.all().filter(cell => cell.isOpen)
  },

  /**
   * セルを開く
   * @param {String} gameId Game の ID
   * @param {Object} cell Cell
   * @returns 開いているセルのリスト
   */
  async create (gameId, cell) {
    const game = await gameRepository.get(gameId)

    game.open(cell.x, cell.y)
    const updated = await gameRepository.update(game)

    return updated.field.all().filter(cell => cell.isOpen)
  }
}

module.exports = OpenCellController
