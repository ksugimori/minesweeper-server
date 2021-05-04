const Cell = require('../../lib/models/Cell.js')
const Point = require('../../lib/models/util/Point.js')
const CellView = require('../../lib/views/CellView.js')

describe('CellView', () => {
  describe('#toJSON', () => {
    test('x, y, count が反映されること', () => {
      const point = Point.of(1, 2)
      const cell = new Cell(point)
      cell.count = 8

      const view = new CellView(cell)
      expect(view.toJSON().x).toBe(1)
      expect(view.toJSON().y).toBe(2)
      expect(view.toJSON().count).toBe(8)
    })
  })
})
