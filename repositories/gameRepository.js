const Game = require('../models/Game')
const pool = require('../db/pool.js')

const GameRepository = {
  async create (game) {
    const connection = pool.promise()

    try {
      const params = game.save()

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
  },

  async get (id) {
    const connection = pool.promise()

    try {
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query('SELECT * FROM `games` WHERE id = ?', [id])

      if (results[0]) {
        return Game.restore(results[0])
      } else {
        return null
      }
    } catch (err) {
      console.error(err)
      return null
    }
  }
}

module.exports = GameRepository
