/* 用户接口文件 */
const db = require('../db')
const express = require('express')
const router = express.Router()
const pgsql = require('pg')
const utils = require('../utils')
const $sql = require('../sqlMap')

const conn = pgsql.Pool(db.pgsql)
conn.connect()

// 用户注册接口

// 用户登录接口
router.post('/login', (req, res) => {
  const input_password = req.body.password
  const token = req.body.token
  const sqlData = [req.body.std_id]

  conn.query($sql.user.getLoginResponse, sqlData, (error, result) => {
    if (error) {
      console.log(error)
      res.send(false)
    }

    // 登陆验证
    if (result.rowCount == 1 && input_password === result.rows[0].password) {
      // 更新 token 并返回用户 id
      const id = result.rows[0].id
      updateToken(id, token)
      res.send({ id: id })
    } else {
      res.send(false)
    }
  })
})

function updateToken (id, token) { // 保存登陆令牌到数据库
  const expiration_time = 86400000 // 令牌过期时间为 1 天
  const expiration_date = new Date().getTime() + expiration_time
  const sqlData = [token, expiration_date, id]

  conn.query($sql.token.updateToken, sqlData, function (error) {
    if (error) {
      console.log(error)
    }
  })
}

// 用户 token 验证接口
router.post('/checkToken', async function (req, res) {
  const id = req.body.id
  const token = req.headers.authorization
  const flag = await checkToken(id, token)
  if (flag === true) {
    res.send(true)
  } else {
    res.send(false)
  }
})

async function checkToken (id, token) { // 用户 token 验证
  const sqlData = [id]

  let response = await conn.query($sql.token.getTokenResponse, sqlData)
  if (response.rowCount == 1) { // 得到数据库返回的结果
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

// 获取用户资料接口
router.post('/queryUserInfo', (req, res) => {
  const id = req.body.id
})

// 修改用户资料接口

// 用户统计资料接口

module.exports = router
