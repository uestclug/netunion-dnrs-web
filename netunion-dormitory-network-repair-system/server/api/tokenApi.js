/* eslint-disable camelcase */
/* Token 接口文件 */
const db = require('../db')
const express = require('express')
const router = express.Router()
const pgsql = require('pg')
// const utils = require('../utils')
const apiUtils = require('./apiUtils')

// const $sql = require('../sqlMap')
// const $common = require('../common')

const conn = new pgsql.Pool(db.pgsql)
conn.connect()

// 用户 token 验证接口
router.post('/checkToken', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    res.send(true)
  } else {
    res.send(false)
  }
})

module.exports = router
