const random = require('../../../lib/models/util/random.js')
const Point = require('../../../lib/models/util/Point.js')

describe('random', () => {
  describe('#points', () => {
    test('指定した長さの配列が返されること', () => {
      const setting = { width: 3, height: 3, numMines: 2 }
      const result = random.points(setting, Point.of(0, 0))

      expect(result.length).toBe(2)
    })

    test('除外対象の座標が含まれないこと', () => {
      const exclude = Point.of(1, 1)

      for (let i = 0; i < 9; i++) {
        const setting = { width: 3, height: 3, numMines: 8 }
        const result = random.points(setting, exclude)
        expect(result.includes(exclude)).toBeFalsy()
      }
    })
  })
})
