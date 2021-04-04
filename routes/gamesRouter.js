const express = require('express')
const router = express.Router()
const Game = require('../models/Game')
const Setting = require('../models/Setting')
const gameRepository = require('../repositories/gameRepository')
const GameView = require('../views/GameView')

/**
 * Game の作成
 */
router.post('/', async function (req, res) {
  const game = new Game()
  game.setting = req.body.setting || Setting.EASY

  // TODO 暫定的に open させておく。open用のAPI作成後に削除
  game.initialize()
  game.open(0, 0)

  const created = await gameRepository.create(game)

  res.status(201).json(GameView.wrap(created))
})

/**
 * Game の取得
 */
router.get('/:id', async function (req, res) {
  const game = await gameRepository.get(req.params.id)

  if (game) {
    res.status(200).json(GameView.wrap(game))
  } else {
    res.status(404).end()
  }
})

// ネストしたルーティングをセット
require('./games/flagsRouter').route(router)

module.exports = router
