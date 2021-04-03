const express = require('express')
const { route } = require('.')
const router = express.Router()
const Game = require('../models/Game')
const Setting = require('../models/Setting')
const gameRepository = require('../repositories/gameRepository')
const GameView = require('../views/GameView')

/* Game の作成 */
router.post('/', async function (req, res) {
  // TODO 例外処理

  const game = new Game()
  game.setting = req.body.setting || Setting.EASY

  game.initialize()
  game.open(0, 0)

  const created = await gameRepository.create(game)

  res.status(201).json(GameView.wrap(created))
})

router.get('/:id', async function (req, res) {
  const game = await gameRepository.get(req.params.id)

  if (game) {
    res.status(200).json(GameView.wrap(game))
  } else {
    res.status(404).end()
  }
})

router.post('/:id/flags', async function (req, res) {
  const game = await gameRepository.get(req.params.id)

  if (game) {
    const point = { x: req.body.x, y: req.body.y }

    if (game.field.cellAt(point).isFlag) {
      res.status(204).end()
      return
    }

    game.flag(point.x, point.y)
    await gameRepository.update(game)

    res.status(201).json(point)
  } else {
    res.status(404).end()
  }
})

module.exports = router
