const GameRepository = require('../repositories/GameRepository')
const OpenCellRepository = require('../repositories/OpenCellRepository')

const OpenCellController = {
  /**
   * 開いているセルのリストを取得する。
   * @returns 開いているセルのリスト
   */
  async get (req, res, next) {
    try {
      const game = await GameRepository.from().get(req.params.gameId)
      const result = game.field.all().filter(cell => cell.isOpen)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  },

  /**
   * セルを開く
   * @returns 開いているセルのリスト
   */
  async create (req, res, next) {
    const gameRepository = GameRepository.from()

    try {
      const game = await gameRepository.get(req.params.gameId)
      const before = game.field.points(cell => cell.isOpen)

      game.open(req.body.x, req.body.y)

      const after = game.field.points(cell => cell.isOpen)
      const insertPoints = after.filter(p => !before.some(q => q.equals(p)))

      if (Array.isArray(insertPoints) && insertPoints.length) {
        await gameRepository.update(game)
        const openCellRepository = OpenCellRepository.from()
        await openCellRepository.createAll(game.id, insertPoints)

        const openCells = game.field.all().filter(cell => cell.isOpen)
        res.status(201).json(openCells)
      } else {
        const openCells = game.field.all().filter(cell => cell.isOpen)
        res.status(200).json(openCells)
      }
    } catch (err) {
      next(err)
    }
  },

  /**
   * 開いたセルを閉じる
   */
  delete (req, res) {
    res.status(405).end()
  }
}

module.exports = OpenCellController
