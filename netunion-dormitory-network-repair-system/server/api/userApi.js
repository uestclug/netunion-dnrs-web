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
  console.log("post!")
})

// 修改用户资料接口

// 用户统计资料接口

module.exports = router
