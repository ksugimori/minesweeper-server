const dbUtils = require('../db/dbUtils.js')
const GameRepository = require('../repositories/GameRepository')
const OpenCellRepository = require('../repositories/OpenCellRepository')

const OpenCellController = {
  /**
   * 開いているセルのリストを取得する。
   * @returns 開いているセルのリスト
   */
  async get (req, res, next) {
    dbUtils.doTransaction(async connection => {
      const game = await GameRepository.from(connection).get(req.params.gameId)
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
      const openCellRepository = OpenCellRepository.from(connection)

      const game = await gameRepository.get(req.params.gameId)
      const beforeStatus = game.status
      const before = game.field.points(cell => cell.isOpen)

      // セルを開く（関連して開くセルもこの時点で開かれる）
      game.open(req.body.x, req.body.y)

      // 今回の操作で開かれたセルを特定する
      const after = game.field.points(cell => cell.isOpen)
      const insertPoints = after.filter(p => !before.some(q => q.equals(p)))

      if (Array.isArray(insertPoints) && insertPoints.length) {
        if (beforeStatus !== game.status) {
          await gameRepository.update(game)
        }
        await openCellRepository.createAll(game.id, insertPoints)

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
