/* eslint-disable camelcase */
/* Token 接口文件 */
// const db = require('../db')
const express = require('express')
const router = express.Router()
// const pgsql = require('pg')
// const utils = require('../utils')
const apiUtils = require('./apiUtils')

// const $sql = require('../sqlMap')
// const $common = require('../common.js')

// const conn = new pgsql.Pool(db.pgsql)

/**
 * 用户 token 验证接口
 * 当用户的 token 信息有效且 role 有效时，返回 true；
 * 其它情况返回 false。
 */
router.post('/checkToken', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    res.send(true)
  } else {
    res.send(false)
  }
})

module.exports = router
