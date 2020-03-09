/* 订单接口文件 */
const db = require('../db')
const express = require('express')
const router = express.Router()
const pgsql = require('pg')
const utils = require('../utils')
const $sql = require('../sqlMap')
const $common = require('../common')

const conn = pgsql.Pool(db.pgsql)
conn.connect()

// 用户新建订单接口
router.post('/createOrder', (req, res) => {
  const body = req.body
  const user_name = body.user_name
  const user_gender = body.user_gender
  const user_telephone = body.user_telephone
  const user_campus = body.user_campus
  const user_dormitory = body.user_dormitory
  const user_description = body.user_description
  const user_id = body.user_id
  const order_status = $common.status.waiting
  const nowDate = new Date()
  const order_id = nowDate.getTime()
  const order_date = nowDate.toLocaleString()
  const sqlData = [user_name, user_gender, user_telephone, user_campus, user_dormitory, user_description, order_date, order_status, order_id, null, user_id]

  conn.query($sql.order.createOrder, sqlData, (error) => {
    if (error) {
      console.log(error)
      res.send(false)
    } else {
      const result = {
        order_dormitory: user_dormitory,
        order_status: order_status,
        order_name: user_name,
        order_campus: user_campus,
        order_telephone: user_telephone,
        order_description: user_description,
        order_date: order_date,
        order_id: order_id
      }
      res.send(result)
    }
  })
})

// solver 新建订单接口
router.post('/createOrderBySolver', (req, res) => {
  const body = req.body
})

// 接受订单接口

// 获取订单信息接口

// 查看历史订单接口

// 修改订单信息接口

// 删除订单接口

module.exports = router