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
  const username = [req.body.username]

  conn.query($sql.user.getPassword, username, function (error, result) {
    if (error) {
      console.log(error)
      res.send(false)
    }

    console.log(result)
    if (result.rowCount == 1) {
      const read_password = result.rows[0].password
      if (input_password === read_password) {
        res.send(true)
      } else {
        res.send(false)
      }
    } else {
      res.send(false)
    }
  })
})

// 修改用户资料接口

// 用户统计资料接口

module.exports = router
