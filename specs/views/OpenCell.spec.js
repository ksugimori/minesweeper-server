const Cell = require('../../lib/models/Cell.js')
const OpenCell = require('../../lib/views/OpenCell.js')

describe('OpenCell', () => {
  describe('#toJSON', () => {
    test('count が反映されること', () => {
      const cell = new Cell({ count: 8 })
      expect(cell.count).toBe(8)

      const json = OpenCell.wrap(cell).toJSON()
      expect(json.count).toBe(8)
    })
  })
})
