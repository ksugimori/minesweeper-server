const Cell = require('../../lib/models/Cell')
const OpenCellView = require('../../lib/views/OpenCellView.js')

describe('OpenCellView', () => {
  describe('#toJSON', () => {
    test('x, y, count が反映されること', () => {
      const cell = new Cell({ x: 1, y: 2 })
      cell.count = 3

      const view = OpenCellView.wrap(cell)

      const json = JSON.stringify(view)
      const result = JSON.parse(json)
      expect(result.x).toBe(1)
      expect(result.y).toBe(2)
      expect(result.count).toBe(3)
    })

    test('isMine, isOpen, isFlag はシリアライズされないこと', () => {
      const cell = new Cell({ x: 1, y: 2 })
      cell.count = 3
      cell.isMine = true
      cell.isOpen = true
      cell.isFlag = true

      const view = OpenCellView.wrap(cell)

      const json = JSON.stringify(view)
      const result = JSON.parse(json)

      expect(result.x).toBe(1)
      expect(result.y).toBe(2)
      expect(result.count).toBe(3)
      expect(result.isMine).toBeUndefined()
      expect(result.isOpen).toBeUndefined()
      expect(result.isFlag).toBeUndefined()
    })
  })
})
