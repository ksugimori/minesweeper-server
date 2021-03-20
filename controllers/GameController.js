const Game = require('../models/Game')
const Setting = require('../models/Setting')
const pool = require('../db/pool.js')

class GameController {
  create (setting) {
    const game = new Game()
    game.setting = setting || Setting.EASY

    game.initialize()

    // TODO DB保存

    return game
  }

  async get (id) {
    try {
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await pool.promise().query('SELECT * FROM `games` WHERE id = ?', [id])

      const games = results.map(Game.restore)

      return games[0]
    } catch (err) {
      console.error(err)
      return null
    }
  }
}

module.exports = new GameController()
