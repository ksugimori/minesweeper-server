const express = require('express')
const router = express.Router()
const GameController = require('../lib/controllers/GameController')
const OpenCellController = require('../lib/controllers/OpenCellController')
const FlagController = require('../lib/controllers/FlagController')
const exceptionHandler = require('../lib/exceptions/exceptionHandler')

// games
router.post('/', GameController.validateRequest, GameController.create)
router.get('/:id', GameController.get)
router.get('/:id/status', GameController.getStatus)

// open-cells
router.get('/:gameId/open-cells', OpenCellController.get)
router.post('/:gameId/open-cells', OpenCellController.create)
router.delete('/:gameId/open-cells/:id', OpenCellController.delete)

// flags
router.get('/:gameId/flags', FlagController.get)
router.post('/:gameId/flags', FlagController.create)
router.delete('/:gameId/flags/:id', FlagController.delete)

// エラー処理
router.use(exceptionHandler)

module.exports = router
