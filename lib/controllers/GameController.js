const dbUtils = require('../db/dbUtils.js')
const GameView = require('../views/GameView')
const Game = require('../models/Game')
const GameRepository = require('../repositories/GameRepository')
const CellRepository = require('../repositories/CellRepository')

const GameController = {
  /**
   * リクエストのバリデーション
   */
  validateRequest (req, res, next) {
    const game = req.body

    if (game.width && game.height && game.numMines) {
      next()
    } else {
      console.warn('リクエストが不正です。 request = ', req.body)
      res.status(400).end()
    }
  },

  /**
   * ゲームを作成する。
   * @returns 作成された Game
   */
  async create (req, res, next) {
    const game = new Game()

    game.setting.merge(req.body)
    game.initialize()

    dbUtils.doTransaction(async connection => {
      const gameRepository = GameRepository.from(connection)
      const cellRepository = CellRepository.from(connection)

      const createdGame = await gameRepository.create(game)
      await cellRepository.createAll(createdGame.id, createdGame.field.all())

      res.status(201).json(GameView.wrap(createdGame))
    }).catch(err => {
      next(err)
    })
  },

  /**
   * ゲームを取得する。
   * @returns Game
   */
  async get (req, res, next) {
    dbUtils.doTransaction(async connection => {
      const gameRepository = GameRepository.from(connection)
      const game = await gameRepository.get(req.params.id)

      res.status(200).json(GameView.wrap(game))
    }).catch(err => {
      next(err)
    })
  },

  /**
   * ゲームのステータスを取得する。
   * @returns ステータス
   */
  async getStatus (req, res, next) {
    dbUtils.doTransaction(async connection => {
      const gameRepository = GameRepository.from(connection)
      const status = await gameRepository.getStatus(req.params.id)

      res.status(200).json(status)
    }).catch(err => {
      next(err)
    })
  }
}

module.exports = GameController
