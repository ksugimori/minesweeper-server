const Game = require('../models/Game')
const Setting = require('../models/Setting')

class GameController {
  create (setting) {
    const game = new Game()
    game.setting = setting || Setting.EASY

    game.initialize()

    // TODO DB保存

    return game
  }
}

module.exports = new GameController()
