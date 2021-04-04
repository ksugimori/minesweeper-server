const express = require('express')
const router = express.Router()
const Game = require('../models/Game')
const Setting = require('../models/Setting')
const gameRepository = require('../repositories/gameRepository')
const GameView = require('../views/GameView')
const Point = require('../models/util/Point')

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

router.get('/:id/flags', async function (req, res) {
  const game = await gameRepository.get(req.params.id)

  if (game) {
    const flags = game.field.points(cell => cell.isFlag)
    res.status(200).json(flags)
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

router.delete('/:gameId/flags/:id', async function (req, res) {
  const point = Point.parseId(req.params.id)
  const game = await gameRepository.get(req.params.gameId)

  if (game) {
    const cell = game.field.cellAt(point)
    if (cell.isFlag) {
      cell.unflag()
    }
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

module.exports = router
