const express = require('express')
const router = express.Router()
const gameController = require('../controllers/GameController')
const mysql = require('mysql2')
const Game = require('../models/Game')

/* Game の作成 */
router.post('/', function (req, res) {
  // TODO 例外処理

  const game = gameController.create(req.body.setting)

  // TODO ここ save した結果から mines を削除したもので良いかも
  res.status(201).json(game)
})

router.get('/test', function (req, res) {
  // create the connection to database
  const connection = mysql.createConnection({
    host: process.env.MS_DB_HOST,
    user: 'ms-user',
    password: 'ms-password',
    database: 'minesweeper'
  })

  // simple query
  connection.query(
    'SELECT * FROM `games`',
    function (err, results) {
      if (err) {
        console.log(err)
      }

      const data = results[0]
      const game = Game.restore({
        width: data.width,
        height: data.height,
        status: data.status,
        mines: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        opens: [{ x: 1, y: 0 }],
        flags: []
      })

      res.status(200).json(game)
    }
  )
})

module.exports = router
