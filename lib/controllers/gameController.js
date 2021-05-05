const GameView = require('../views/GameView')
const Game = require('../models/Game')
const gameRepository = require('../repositories/gameRepository')

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
  async create (req, res) {
    const game = new Game()

    game.setting.merge(req.body)
    game.initialize()

    const created = await gameRepository.create(game)

    res.status(201).json(GameView.wrap(created))
  },

  /**
   * ゲームを取得する。
   * @returns Game
   */
  async get (req, res, next) {
    try {
      const game = await gameRepository.get(req.params.id)
      res.status(200).json(GameView.wrap(game))
    } catch (err) {
      next(err)
    }
  },

  /**
   * ゲームのステータスを取得する。
   * @returns ステータス
   */
  async getStatus (req, res, next) {
    try {
      const game = await gameRepository.get(req.params.id)
      res.status(200).json({ status: game.status.name })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = GameController
