const Status = require('../../../models/status/Status.js')

describe('Status', () => {
  test('INIT, PLAY, WIN, LOSE の４つのステータスが定義されていること', () => {
    expect(Status.INIT).not.toBeUndefined()
    expect(Status.PLAY).not.toBeUndefined()
    expect(Status.WIN).not.toBeUndefined()
    expect(Status.LOSE).not.toBeUndefined()
  })

  test('文字列表現からインスタンスが取得できること', () => {
    expect(Status.parse('INIT')).toBe(Status.INIT)
    expect(Status.parse('PLAY')).toBe(Status.PLAY)
    expect(Status.parse('WIN')).toBe(Status.WIN)
    expect(Status.parse('LOSE')).toBe(Status.WIN)
  })
})
