const Cell = require('../../lib/models/Cell.js')
const Point = require('../../lib/models/util/Point.js')

describe('Cell', () => {
  describe('#id', () => {
    test('(1, 2) のとき x1y2 となること', () => {
      const p = Point.of(1, 2)
      const cell = new Cell(p)

      expect(cell.id).toBe('x1y2')
    })
  })

  describe('#parseId', () => {
    test('id から元の Cell を復元できること', () => {
      const cell = Cell.parseId('x12y34')

      expect(cell.x).toBe(12)
      expect(cell.y).toBe(34)
    })
  })

  describe('#initialize', () => {
    test('初期状態では count=0, isOpen=false, isMine=false, isFlag=false であること', () => {
      const cell = new Cell(Point.of(0, 0))

      expect(cell.count).toBe(0)
      expect(cell.isOpen).toBe(false)
      expect(cell.isMine).toBe(false)
      expect(cell.isFlag).toBe(false)
    })
  })

  describe('#open', () => {
    test('isOpen が true になること', () => {
      const cell = new Cell(Point.of(0, 0))

      cell.open()
      expect(cell.isOpen).toBe(true)

      // 複数回実行しても true のままであること
      cell.open()
      expect(cell.isOpen).toBe(true)
    })
  })

  describe('#mine', () => {
    test('isMine が true になること', () => {
      const cell = new Cell(Point.of(0, 0))

      cell.mine()
      expect(cell.isMine).toBe(true)

      // 複数回実行しても true のままであること
      cell.mine()
      expect(cell.isMine).toBe(true)
    })
  })

  describe('#flag', () => {
    test('isFlag が true になること', () => {
      const cell = new Cell(Point.of(0, 0))

      cell.flag()
      expect(cell.isFlag).toBe(true)

      // 複数回実行しても true のままであること
      cell.flag()
      expect(cell.isFlag).toBe(true)
    })

    test('open 済のセルに対してはフラグは付けられないこと', () => {
      const cell = new Cell(Point.of(0, 0))

      cell.open()
      cell.flag()
      expect(cell.isFlag).toBe(false)
    })

    test('isMine = false のセルにフラグをつけたら isMiss = true になること', () => {
      const cell = new Cell(Point.of(0, 0))

      cell.flag()

      expect(cell.isMiss).toBeTruthy()
    })
  })

  describe('#unflag', () => {
    test('isFlag が false になること', () => {
      const cell = new Cell(Point.of(0, 0))

      cell.unflag()
      expect(cell.isFlag).toBe(false)

      // 複数回実行しても true のままであること
      cell.unflag()
      expect(cell.isFlag).toBe(false)
    })
  })

  describe('#isEmpty', () => {
    test('count が 0 なら true を返し、それ以外なら false を返すこと', () => {
      const cell = new Cell(Point.of(0, 0))

      cell.count = 0
      expect(cell.isEmpty).toBeTruthy()

      cell.count = 1
      expect(cell.isEmpty).toBeFalsy()
    })

    test('count が 0 でも isMine = true なら false を返すこと', () => {
      const cell = new Cell(Point.of(0, 0))

      cell.count = 0
      cell.mine()
      expect(cell.isEmpty).toBeFalsy()
    })
  })
})
