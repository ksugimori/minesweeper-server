const express = require('express')
const router = express.Router()
const Game = require('../lib/models/Game')
const gameRepository = require('../lib/repositories/gameRepository')
const GameView = require('../lib/views/GameView')
const exceptionHandler = require('../lib/exceptions/exceptionHandler')

function validateRequest (req, res, next) {
  const game = req.body

  if (game.width && game.height && game.numMines) {
    next()
  } else {
    console.warn('リクエストが不正です。 request = ', req.body)
    res.status(400).end()
  }
}

/**
 * Game の作成
 */
router.post('/', validateRequest, async function (req, res) {
  const game = new Game()

  game.setting.merge(req.body)

  game.initialize()

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
require('./games/cellsRouter').route(router)
require('./games/flagsRouter').route(router)
require('./games/statusRouter').route(router)

// エラー処理
router.use(exceptionHandler)

module.exports = router
