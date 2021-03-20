const Game = require('../models/Game')
const Setting = require('../models/Setting')
const pool = require('../db/pool.js')

class GameController {
  async create (setting) {
    const game = new Game()
    game.setting = setting || Setting.EASY

    game.initialize()
    game.open(0, 0)

    // TODO DB保存
    const connection = pool.promise()

    try {
      const params = game.save()

      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query('INSERT INTO games SET ?', params)

      game.id = results.insertId

      return game
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async get (id) {
    const connection = pool.promise()

    try {
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query('SELECT * FROM `games` WHERE id = ?', [id])

      return Game.restore(results[0])
    } catch (err) {
      console.error(err)
      return null
    }
  }
}

module.exports = new GameController()
