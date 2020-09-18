/* eslint-disable camelcase */
/* 导出数据接口文件 */
const pool = require('../db')
const express = require('express')
const router = express.Router()
// const utils = require('../utils')
const apiUtils = require('./apiUtils')

const $sql = require('../sqlMap')
const $common = require('../../common.js')

const ExcelJS = require('exceljs')
const nodemailer = require('nodemailer')

/**
 * 导出一段时间内的订单为 excel 表格并发送到指定邮箱接口
 */
router.post('/exportToExcel', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const start_date = reqBody.start_date
    const end_date = reqBody.end_date
    const export_option = reqBody.export_option
    const mail_address = reqBody.mail_address

  } else {
    res.send(false)
  }
})

module.exports = router
