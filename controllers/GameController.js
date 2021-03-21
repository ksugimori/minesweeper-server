const Game = require('../models/Game')
const Setting = require('../models/Setting')
const pool = require('../db/pool.js')
const gameRepository = require('../repositories/gameRepository')

class GameController {
  async create (setting) {
    const game = new Game()
    game.setting = setting || Setting.EASY

    game.initialize()
    game.open(0, 0)

    return await gameRepository.create(game)
  }

  async get (id) {
    const response = gameRepository.get(id)

    return response
  }
}

module.exports = new GameController()
