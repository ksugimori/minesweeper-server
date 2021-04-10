const Setting = require('../../lib/models/Setting.js')

describe('Setting', () => {
  describe('#equals', () => {
    test('全項目が一致する場合のみ同値と判定されること', () => {
      const setting = new Setting(9, 9, 10)

      const same = new Setting(9, 9, 10)
      expect(setting.equals(same)).toBeTruthy()

      const diffWidth = new Setting(10, 9, 10)
      expect(setting.equals(diffWidth)).toBeFalsy()

      const diffHeight = new Setting(9, 10, 10)
      expect(setting.equals(diffHeight)).toBeFalsy()

      const diffMines = new Setting(9, 9, 11)
      expect(setting.equals(diffMines)).toBeFalsy()
    })
  })

  describe('#name', () => {
    test('EASY と等しい場合は EASY が返ること', () => {
      const setting = Setting.EASY.clone()
      expect(setting.name).toBe('EASY')
    })

    test('NORMAL と等しい場合は NORMAL が返ること', () => {
      const setting = Setting.NORMAL.clone()
      expect(setting.name).toBe('NORMAL')
    })

    test('HARD と等しい場合は HARD が返ること', () => {
      const setting = Setting.HARD.clone()
      expect(setting.name).toBe('HARD')
    })

    test('その他の場合は CUSTOM が返ること', () => {
      const setting = Setting.NORMAL.clone()
      setting.width++
      expect(setting.name).toBe('CUSTOM')
    })
  })

  describe('#adjustNumMines', () => {
    test('盤面より多い地雷数が設定されている場合、盤面のセル数 - 1 が設定し直されれること', () => {
      const setting = new Setting(3, 3, 4)

      // この時点では 4 個
      expect(setting.numMines).toBe(4)

      // 1 × 3 にする
      setting.width = 1
      setting.adjustNumMines()

      expect(setting.numMines).toBe(2)
    })
  })
})
