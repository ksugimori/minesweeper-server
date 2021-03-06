const dbUtils = require('../db/dbUtils.js')
const OpenCellView = require('../views/OpenCellView')
const GameRepository = require('../repositories/GameRepository')
const CellRepository = require('../repositories/CellRepository')

const OpenCellController = {
  /**
   * 開いているセルのリストを取得する。
   * @returns 開いているセルのリスト
   */
  async get (req, res, next) {
    const gameId = req.params.gameId

    dbUtils
      .doTransaction(async connection => {
        const game = await GameRepository.use(connection).get(gameId)
        return game.field.all().filter(cell => cell.isOpen)
      })
      .then(resultArray => resultArray.map(c => OpenCellView.wrap(c)))
      .then(resultArray => res.status(200).json(resultArray))
      .catch(err => next(err))
  },

  /**
   * セルを開く
   * @returns 開いているセルのリスト
   */
  async create (req, res, next) {
    const point = req.body

    dbUtils
      .doTransaction(async connection => {
        const game = await GameRepository.use(connection).get(req.params.gameId)
        const isInit = !game.startTime // 初回クリックか？

        // セルを開く（関連して開くセルもこの時点で開かれる）
        game.open(point.x, point.y)

        if (isInit) { // プレイ開始時刻を更新
          await GameRepository.use(connection).updateToStart(game)
        }
        if (game.status.isEnd) {
          await GameRepository.use(connection).updateToEnd(game)
        }

        const updatedCells = game.field.all().filter(cell => cell.isChanged)
        await CellRepository.use(connection).upsertAll(game.id, updatedCells)

        return updatedCells.filter(cell => cell.isOpen)
      })
      .then(resultArray => resultArray.map(c => OpenCellView.wrap(c)))
      .then(resultArray => res.status(resultArray.length > 0 ? 201 : 200).json(resultArray))
      .catch(err => next(err))
  },

  /**
   * 開いたセルを閉じる
   */
  delete (req, res) {
    res.status(405).end()
  }
}

module.exports = OpenCellController
