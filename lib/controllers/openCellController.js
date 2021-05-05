const gameRepository = require('../repositories/gameRepository')

const OpenCellController = {
  /**
   * 開いているセルのリストを取得する。
   * @returns 開いているセルのリスト
   */
  async get (req, res, next) {
    try {
      const game = await gameRepository.get(req.params.gameId)
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
    try {
      const game = await gameRepository.get(req.params.gameId)

      game.open(req.body.x, req.body.y)

      const updated = await gameRepository.update(game)
      const openCells = updated.field.all().filter(cell => cell.isOpen)

      res.status(201).json(openCells)
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
