const express = require('express')
const router = express.Router()
const gameController = require('../lib/controllers/gameController')
const openCellController = require('../lib/controllers/openCellController')
const flagController = require('../lib/controllers/flagController')
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
  const created = await gameController.create(req.body)
  res.status(201).json(GameView.wrap(created))
})

/**
 * Game の取得
 */
router.get('/:id', async function (req, res, next) {
  try {
    const game = await gameController.get(req.params.id)
    res.status(200).json(GameView.wrap(game))
  } catch (err) {
    next(err)
  }
})

/**
 * ステータスの取得
 */
router.get('/:id/status', async function (req, res, next) {
  try {
    const status = await gameController.getStatus(req.params.id)
    res.status(200).json({ status })
  } catch (err) {
    next(err)
  }
})

/**
 * 開いたセル一覧の取得
 */
router.get('/:gameId/open-cells', async function (req, res, next) {
  try {
    const result = await openCellController.get(req.params.gameId)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

/**
 * セルを開く（開いたセルを作る）
 */
router.post('/:gameId/open-cells', async function (req, res, next) {
  try {
    const openCells = await openCellController.create(req.params.gameId, req.body)
    res.status(201).json(openCells)
  } catch (err) {
    next(err)
  }
})

/**
 * 開いたセルを閉じる
 */
router.delete('/:gameId/open-cells/:id', async function (req, res, next) {
  res.status(405).end()
})

/**
 * フラグ一覧の取得
 */
router.get('/:gameId/flags', async function (req, res, next) {
  try {
    const flags = await flagController.get(req.params.gameId)
    res.status(200).json(flags)
  } catch (err) {
    next(err)
  }
})

/**
 * フラグを作成する
 */
router.post('/:gameId/flags', async function (req, res, next) {
  try {
    const point = await flagController.create(req.params.gameId, req.body)

    if (point) {
      res.status(201).json(point)
    } else {
      res.status(204).end()
    }
  } catch (err) {
    next(err)
  }
})

/**
 * フラグを削除する
 */
router.delete('/:gameId/flags/:id', async function (req, res, next) {
  try {
    await flagController.delete(req.params.gameId, req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

// エラー処理
router.use(exceptionHandler)

module.exports = router
