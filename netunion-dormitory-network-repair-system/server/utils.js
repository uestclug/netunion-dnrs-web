/* 公用函数 */
const db = require('./db')
const pgsql = require('pg')
const $sql = require('./sqlMap')
const $common = require('./common')

const conn = pgsql.Pool(db.pgsql)
conn.connect()

const jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: 'json write failed'
    })
    console.log('json write failed.')
  } else {
    res.json(ret)
    console.log('json write success!')
  }
}

// 不满足 digit 位则向 num 前补零
const prefixZero = function (num, digit) {
  return (Array(digit).join(0) + num).slice(-digit)
}

// 验证用户 token 是否有效
async function checkToken(req) { // 用户 token 验证
  const id = req.body.id
  const token = req.headers.authorization
  const sqlData = [id]

  const response = await conn.query($sql.token.getTokenResponse, sqlData)
  if (response.rowCount === 1) { // 得到数据库返回的结果
    const savedToken = response.rows[0].token
    const savedExpirationDate = response.rows[0].expiration_date
    const nowDate = new Date().getTime()
    if (token === savedToken && nowDate < savedExpirationDate) { // 数据库保存的 token 与 localStorage 存储相同且 token 未过期
      return true
    } else {
      return false
    }
  } else { // 数据库无该 id 结果
    return false
  }
}

module.exports = {
  jsonWrite,
  prefixZero,
  checkToken
}
