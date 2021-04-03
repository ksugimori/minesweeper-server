const Point = require('../../../models/util/Point.js')

describe('Point', () => {
  describe('#equals', () => {
    test('同じ座標なら同値であること', () => {
      expect(Point.of(1, 2).equals(Point.of(1, 2))).toBeTruthy()
    })

    test('x, y どちらか一方でも異なるなら異なる値であること', () => {
      // x 座標が異なる
      expect(Point.of(1, 1).equals(Point.of(9, 1))).toBeFalsy()

      // y 座標が異なる
      expect(Point.of(1, 1).equals(Point.of(1, 9))).toBeFalsy()
    })
  })

  describe('Getter', () => {
    test('x座標、y座標が取得できること', () => {
      const p = Point.of(2, 1)

      expect(p.y).toBe(1)
      expect(p.x).toBe(2)
    })
  })

  describe('#addX, #addY', () => {
    test('x座標、y座標に加算したPointが取得できること', () => {
      const p = Point.of(0, 0)

      // 初期値
      expect(p.equals(Point.of(0, 0))).toBeTruthy()

      // y座標の変更
      expect(p.addY(1).equals(Point.of(0, 1))).toBeTruthy()
      expect(p.addY(-2).equals(Point.of(0, -2))).toBeTruthy()

      // x座標の変更
      expect(p.addX(10).equals(Point.of(10, 0))).toBeTruthy()
      expect(p.addX(-5).equals(Point.of(-5, 0))).toBeTruthy()

      // チェインできること
      const result = p.addY(2).addX(3).addY(2)
      expect(result.equals(Point.of(3, 4))).toBeTruthy()
    })
  })

  describe('#toJSON', () => {
    test('JSONとしてシリアライズしたときに x, y 座標が残ること', () => {
      const p = Point.of(1, 2)

      const result = JSON.stringify(p)

      expect(result).toBe('{"x":1,"y":2}')
    })
  })

  describe('#id', () => {
    test('x, y 座標をアンダースコアでつないだ文字列であること', () => {
      const p = Point.of(1, 2)

      expect(p.id).toBe('1_2')
    })
  })

  describe('#parseId', () => {
    test('id から元の Point を復元できること', () => {
      const p = Point.parseId('12_34')

      expect(p.x).toBe(12)
      expect(p.y).toBe(34)
    })
  })
})
