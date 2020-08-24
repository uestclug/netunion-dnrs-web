/* eslint-disable camelcase */
/* 关于页面接口文件 */
const db = require('../db')
const express = require('express')
const router = express.Router()
const pgsql = require('pg')
// const utils = require('../utils')
const apiUtils = require('./apiUtils')

const $sql = require('../sqlMap')
const $common = require('../common')

const conn = new pgsql.Pool(db.pgsql)
conn.connect()

const monthCount = 30 // 众所周知，一个月我们可以认为有 30 天
const monthTime = 2592000000 // 一个月的时间用毫秒表示：1000ms * 60 * 60 * 24 * 30
const dayTime = 86400000 // 一天的时间用毫秒表示：1000ms * 60 * 60 * 24

/**
 * 获取三十天里每日创建有效订单数的接口
 * 返回存储有每天创建有效订单数的数组
 */
router.post('/queryCreateOrderMonthly', (req, res) => {
  const nowTime = new Date().getTime()
  const beforeTime = nowTime - monthTime

  // todo: 先从数据库获取信息，若信息过期则获取数据返回并存储到数据库
  conn.query($sql.about.queryCreateOrderInfo, [beforeTime], (error, result) => {
    if (error) {
      console.log(error)
      res.send(false)
    } else {
      const orderCount = result.rowCount // 订单总数
      const createOrderMonthly = new Array(monthCount)
      for (let i = 0; i < monthCount; i++) { // 初始化数组，默认值为 0
        createOrderMonthly[i] = 0
      }
      for (let i = 0; i < orderCount; i++) { // 为数组赋值，如 createOrderMonthly[29] 表示 29 至 30 天前的订单
        const distanceTime = nowTime - result.rows[i].create_date // 订单创建日期距现在的时间
        const day = Math.floor(distanceTime / dayTime) // 向下取整，该订单 day 至 day + 1 以内时间创建的订单
        createOrderMonthly[day] += 1 // 对应数组位置值加一
      }
      res.send({
        valueCreateOrder: createOrderMonthly,
        orderCount: orderCount
      })
    }
  })
})

/**
 * 获取三十天里每日完成有效订单数的接口
 * 返回存储有每天完成有效订单数的数组
 */
router.post('/queryFinishedOrderMonthly', (req, res) => {
  const nowTime = new Date().getTime()
  const beforeTime = nowTime - monthTime

  // todo: 先从数据库获取信息，若信息过期则获取数据返回并存储到数据库
  conn.query($sql.about.queryFinishedOrderInfo, [beforeTime], (error, result) => {
    if (error) {
      console.log(error)
      res.send(false)
    } else {
      const orderCount = result.rowCount
      const finishOrderMonthly = new Array(monthCount)
      for (let i = 0; i < monthCount; i++) {
        finishOrderMonthly[i] = 0
      }
      for (let i = 0; i < orderCount; i++) {
        const distanceTime = nowTime - result.rows[i].create_date
        const day = Math.floor(distanceTime / dayTime)
        finishOrderMonthly[day] += 1
      }
      res.send({
        valueFinishOrder: finishOrderMonthly,
        orderCount: orderCount
      })
    }
  })
})

/**
 * 获取三十天里存在完成订单数的处理者的接口
 * 返回存储有 {user_id, name, nickname, intro, finish_order_count} 对象的数组
 */
router.post('/queryMostValuableSolverMonthly', (req, res) => {
  const nowTime = new Date().getTime()
  const beforeTime = nowTime - monthTime

  conn.query($sql.about.queryMostValuableSolverInfo, [beforeTime], (error, result) => {
    if (error) {
      console.log(error)
      res.send(false)
    } else {
      res.send(result.rows)
    }
  })
})

module.exports = router
