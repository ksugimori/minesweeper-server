const Game = require('../models/Game')
const gameRepository = require('../repositories/gameRepository')

const GameController = {
  /**
   * ゲームを作成する。
   * @param {Game} request リクエスト（width, height, numMines のみ使用されます）
   * @returns 作成された Game
   */
  async create (request) {
    const game = new Game()

    game.setting.merge(request)
    game.initialize()

    return await gameRepository.create(game)
  },

  /**
   * ゲームを取得する。
   * @param {String} id ID
   * @returns Game
   */
  async get (id) {
    return await gameRepository.get(id)
  }
}

module.exports = GameController
