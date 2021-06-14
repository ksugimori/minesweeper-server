const pool = require('./pool.js')

/**
 * トランザクション制御された状態で func を実行する。
 * @param {Function}} func 処理
 * @returns func の実行結果
 */
async function doTransaction (func) {
  const connection = await pool.promise().getConnection()

  try {
    await connection.query('START TRANSACTION')

    const result = await func(connection)

    await connection.query('COMMIT')

    return result
  } catch (err) {
    await connection.query('ROLLBACK')
    throw err
  } finally {
    connection.release()
  }
}

module.exports = { doTransaction }
