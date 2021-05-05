const Game = require('../models/Game')
const gameRepository = require('../repositories/gameRepository')

const GameController = {
  async create (request) {
    const game = new Game()

    game.setting.merge(request)
    game.initialize()

    return await gameRepository.create(game)
  },

  async get (id) {
    return await gameRepository.get(id)
  }
}

module.exports = GameController
