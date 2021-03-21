const express = require('express')
const router = express.Router()
const gameController = require('../controllers/GameController')

/* Game の作成 */
router.post('/', async function (req, res) {
  // TODO 例外処理

  const game = await gameController.create(req.body.setting)

  // TODO ここ save した結果から mines を削除したもので良いかも
  game.stopWatch = game.stopWatch.startTime // TODO timer がシリアライズできない
  res.status(201).json(game)
})

router.get('/:id', async function (req, res) {
  const game = await gameController.get(req.params.id)

  if (game) {
    res.status(200).json(game)
  } else {
    res.status(404).end()
  }
})

module.exports = router
