const express = require('express')
const router = express.Router()
const gameController = require('../controllers/GameController')

/* Game の作成 */
router.post('/', function (req, res) {
  // TODO 例外処理

  const game = gameController.create(req.body.setting)

  // TODO ここ save した結果から mines を削除したもので良いかも
  res.status(201).json(game)
})

module.exports = router
