const express = require('express')
const router = express.Router()
const Game = require('../models/Game')
const Setting = require('../models/Setting')
const gameRepository = require('../repositories/gameRepository')

/* Game の作成 */
router.post('/', async function (req, res) {
  // TODO 例外処理

  const game = new Game()
  game.setting = req.body.setting || Setting.EASY

  game.initialize()
  game.open(0, 0)

  const created = await gameRepository.create(game)

  // TODO ここ save した結果から mines を削除したもので良いかも
  created.stopWatch = created.stopWatch.startTime // TODO timer がシリアライズできない
  res.status(201).json(created)
})

router.get('/:id', async function (req, res) {
  const game = await gameRepository.get(req.params.id)

  if (game) {
    res.status(200).json(game)
  } else {
    res.status(404).end()
  }
})

module.exports = router
