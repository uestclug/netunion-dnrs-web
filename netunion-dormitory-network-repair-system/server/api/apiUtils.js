/* eslint-disable camelcase */
/* api 公用函数 */
const md5 = require('js-md5')

const db = require('../db')
const pgsql = require('pg')
// const utils = require('../utils')
const Base64 = require('js-base64').Base64

const $sql = require('../sqlMap')
// const $common = require('../common')

const conn = new pgsql.Pool(db.pgsql)
conn.connect()

// 验证用户 token 是否有效
async function checkToken (req) { // 用户 token 验证
  const reqBody = req.body
  const user_id = reqBody.user_id // 从请求体获取 user_id
  const token = req.headers.authorization // 从请求头获取 token
  const sqlData = [user_id]

  const response = await conn.query($sql.token.getToken, sqlData)
  if (response.rowCount === 1) { // 得到数据库返回的结果
    const savedToken = response.rows[0].token
    const savedExpirationDate = response.rows[0].expiration_date
    const nowDate = new Date().getTime()
    if (token === savedToken && nowDate < savedExpirationDate) { // 数据库保存的 token 与 localStorage 存储相同且 token 未过期
      return true
    } else {
      return false
    }
  } else { // 数据库无该 user_id 结果
    return false
  }
}

// 生成随机的 token 令牌
function generateToken () {
  const unscrambleToken = new Date().getTime().toString() + Math.floor(Math.random() * 10000 + 1).toString()
  const token = md5(Base64.encode(unscrambleToken))
  return token
}

// 设置数据库中的 token 信息
function setToken (user_id, token, expiration_date) {
  const sqlData = [token, expiration_date, user_id]

  conn.query($sql.token.setToken, sqlData, (error) => {
    if (error) {
      console.log(error)
      return false
    } else {
      return true
    }
  })
}

module.exports = {
  checkToken,
  generateToken,
  setToken
}
