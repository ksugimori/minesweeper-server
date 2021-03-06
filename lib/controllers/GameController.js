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

    dbUtils
      .doTransaction(async connection => {
        const createdGame = await GameRepository.use(connection).create(game)
        await CellRepository.use(connection).upsertAll(createdGame.id, createdGame.field.all())

        return createdGame
      })
      .then(result => GameView.wrap(result))
      .then(result => res.status(201).json(result))
      .catch(err => next(err))
  },

  /**
   * ゲームを取得する。
   * @returns Game
   */
  async get (req, res, next) {
    const gameId = req.params.id

    dbUtils
      .doTransaction(async connection => await GameRepository.use(connection).get(gameId))
      .then(result => GameView.wrap(result))
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  },

  /**
   * ゲームのステータスを取得する。
   * @returns ステータス
   */
  async getStatus (req, res, next) {
    const gameId = req.params.id

    dbUtils
      .doTransaction(async connection => await GameRepository.use(connection).getStatus(gameId))
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  }
}

module.exports = GameController
