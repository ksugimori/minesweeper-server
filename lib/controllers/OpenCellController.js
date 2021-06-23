const dbUtils = require('../db/dbUtils.js')
const GameRepository = require('../repositories/GameRepository')
const CellRepository = require('../repositories/CellRepository')

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
      const cellRepository = CellRepository.from(connection)

      const game = await gameRepository.get(req.params.gameId)
      const beforeStatus = game.status
      const beforeOpenCells = game.field.points(cell => cell.isOpen)

      // TODO Game にメソッド作成？
      game.field.all().forEach(cell => cell.reset())

      // セルを開く（関連して開くセルもこの時点で開かれる）
      game.open(req.body.x, req.body.y)

      const updated = game.field.all().filter(cell => cell.isChanged)
      cellRepository.createAll(game.id, updated)

      if (beforeStatus !== game.status) {
        await gameRepository.updateStatus(game)
      }

      // 今回の操作で開かれたセルを特定する
      const after = game.field.points(cell => cell.isOpen)
      const insertPoints = after.filter(p => !beforeOpenCells.some(q => q.equals(p)))

      if (Array.isArray(insertPoints) && insertPoints.length) {
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
