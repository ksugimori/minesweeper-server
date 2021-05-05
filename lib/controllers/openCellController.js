const gameRepository = require('../repositories/gameRepository')

const OpenCellController = {
  async get (gameId) {
    const game = await gameRepository.get(gameId)
    return game.field.all().filter(cell => cell.isOpen)
  },

  async create (gameId, point) {
    const game = await gameRepository.get(gameId)

    game.open(point.x, point.y)
    const updated = await gameRepository.update(game)

    return updated.field.all().filter(cell => cell.isOpen)
  }
}

module.exports = OpenCellController
