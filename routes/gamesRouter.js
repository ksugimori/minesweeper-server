const express = require('express')
const router = express.Router()
const Game = require('../lib/models/Game')
const Setting = require('../lib/models/Setting')
const gameRepository = require('../lib/repositories/gameRepository')
const GameView = require('../lib/views/GameView')
const exceptionHandler = require('../lib/exceptions/exceptionHandler')

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
router.get('/:id', async function (req, res, next) {
  try {
    const game = await gameRepository.get(req.params.id)
    res.status(200).json(GameView.wrap(game))
  } catch (err) {
    next(err)
  }
})

// ネストしたルーティングをセット
require('./games/flagsRouter').route(router)
require('./games/opensRouter').route(router)
require('./games/statusRouter').route(router)

// エラー処理
router.use(exceptionHandler)

module.exports = router
