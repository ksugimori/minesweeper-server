const Status = require('../../../lib/models/status/Status.js')
const Point = require('../../../lib/models/util/Point.js')
const Game = require('../../../lib/models/Game.js')
jest.mock('../../../lib/models/Game.js')

beforeEach(() => {
  Game.mockClear()
})

describe('Status.LOSE', () => {
  let game
  beforeEach(() => {
    game = new Game()
    game.status = Status.LOSE
  })

  describe('#open', () => {
    test('doOpen が呼ばれないこと', () => {
      Status.LOSE.open(game, Point.of(0, 0))

      expect(game.doOpen.mock.calls.length).toBe(0)
    })
  })

  describe('#flag', () => {
    test('doFlag が呼ばれないこと', () => {
      Status.LOSE.open(game, Point.of(0, 0))

      expect(game.doFlag.mock.calls.length).toBe(0)
    })
  })

  describe('#isEnd', () => {
    test('false であること', () => {
      expect(Status.LOSE.isEnd).toBeTruthy()
    })
  })
})
