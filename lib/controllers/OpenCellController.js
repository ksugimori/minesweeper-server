const dbUtils = require('../db/dbUtils.js')
const Status = require('../models/status/Status')
const GameRepository = require('../repositories/GameRepository')
const CellRepository = require('../repositories/CellRepository')

const OpenCellController = {
  /**
   * 開いているセルのリストを取得する。
   * @returns 開いているセルのリスト
   */
  async get (req, res, next) {
    dbUtils.doTransaction(async connection => {
      const gameRepository = GameRepository.from(connection)

      const game = await gameRepository.get(req.params.gameId)

      const openCell = game.field.all().filter(cell => cell.isOpen)
      res.status(200).json(openCell)
    }).catch(err => {
      next(err)
    })
  },

  /**
   * セルを開く
   * @returns 開いているセルのリスト
   */
  async create (req, res, next) {
    dbUtils.doTransaction(async connection => {
      const gameRepository = GameRepository.from(connection)
      const cellRepository = CellRepository.from(connection)

      const game = await gameRepository.get(req.params.gameId)
      const isInit = (game.status === Status.INIT)

      // セルを開く（関連して開くセルもこの時点で開かれる）
      game.open(req.body.x, req.body.y)

      if (isInit) {
        await gameRepository.startGame(game)
      }
      if (game.status.isEnd) {
        await gameRepository.endGame(game)
      }

      const updatedCells = game.field.all().filter(cell => cell.isChanged)
      await cellRepository.upsertAll(game.id, updatedCells)

      if (updatedCells.length > 0) {
        const openCells = game.field.all().filter(cell => cell.isOpen)
        res.status(201).json(openCells)
      } else {
        const openCells = game.field.all().filter(cell => cell.isOpen)
        res.status(200).json(openCells)
      }
    }).catch(err => {
      next(err)
    })
  },

  /**
   * 開いたセルを閉じる
   */
  delete (req, res) {
    res.status(405).end()
  }
}

module.exports = OpenCellController
