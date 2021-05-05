const express = require('express')
const router = express.Router()
const GameController = require('../lib/controllers/GameController')
const OpenCellController = require('../lib/controllers/OpenCellController')
const FlagController = require('../lib/controllers/FlagController')
const exceptionHandler = require('../lib/exceptions/exceptionHandler')

// games
router.post('/games', GameController.validateRequest, GameController.create)
router.get('/games/:id', GameController.get)
router.get('/games/:id/status', GameController.getStatus)

// open-cells
router.get('/games/:gameId/open-cells', OpenCellController.get)
router.post('/games/:gameId/open-cells', OpenCellController.create)
router.delete('/games/:gameId/open-cells/:id', OpenCellController.delete)

// flags
router.get('/games/:gameId/flags', FlagController.get)
router.post('/games/:gameId/flags', FlagController.create)
router.delete('/games/:gameId/flags/:id', FlagController.delete)

// エラー処理
router.use(exceptionHandler)

module.exports = router
