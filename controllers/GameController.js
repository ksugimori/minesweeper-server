const Game = require('../models/Game')
const Setting = require('../models/Setting')
const pool = require('../db/pool.js')

class GameController {
  async create (setting) {
    const game = new Game()
    game.setting = setting || Setting.EASY

    game.initialize()
    game.open(0, 0)

    const connection = pool.promise()

    try {
      const params = game.save()
      params.mines = JSON.stringify(params.mines)
      params.opens = JSON.stringify(params.opens)
      params.flags = JSON.stringify(params.flags)

      // eslint-disable-next-line no-unused-vars
      const sql = connection.format('INSERT INTO `games` SET ?', params)
      console.log(sql)
      const [results, fields] = await connection.query(sql)

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
