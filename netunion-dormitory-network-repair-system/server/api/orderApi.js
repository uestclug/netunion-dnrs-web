/* eslint-disable camelcase */
/* 订单接口文件 */
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

/**
 * 用户新建订单接口
 * 当 token 验证成功且用户能够创建订单时访问数据库进行操作。
 */
router.post('/createOrderUser', async function (req, res) {
  const checkTokenFlag = await apiUtils.checkToken(req)
  if (checkTokenFlag) {
    const reqBody = req.body
    const checkLatestOrderStatusFlag = await apiUtils.latestOrderStatusCheck(reqBody.user_id)
    if (checkLatestOrderStatusFlag && reqBody.role == $common.role.user) {
      const user_name = reqBody.user_name
      const user_gender = reqBody.user_gender
      const user_telephone = reqBody.user_telephone
      const user_campus = reqBody.user_campus
      const user_dormitory = reqBody.user_dormitory
      const user_description = reqBody.user_description
      const order_status = $common.status.waiting // 设置等待接单
      const user_id = reqBody.user_id
      const order_id = apiUtils.generateOrderId(user_id) // 根据用户的 user_id 生成订单号
      const create_date = new Date().toLocaleString()
      const sqlData = [user_name, user_gender, user_telephone, user_campus, user_dormitory, user_description, create_date, order_status, order_id, user_id]

      conn.query($sql.order.user.createOrder, sqlData, (error) => {
        if (error) {
          console.log(error)
          res.send(false)
        } else {
          res.send(true)
        }
      })
    } else {
      res.send(false)
    }
  } else {
    res.send(false)
  }
})

/**
 * 处理者记录订单接口
 * 当 token 验证成功时访问数据库进行操作。
 */
router.post('/createOrderSolver', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const user_name = reqBody.user_name
    const user_gender = reqBody.user_gender
    const user_telephone = reqBody.user_telephone
    const user_campus = reqBody.user_campus
    const user_dormitory = reqBody.user_dormitory
    const order_status = reqBody.order_status
    const user_description = reqBody.user_description
    const solver_record = reqBody.solver_record
    const nowDate = new Date()
    let solver_id = reqBody.user_id
    const order_id = apiUtils.generateOrderId(solver_id) // 根据处理者的 user_id 生成订单号
    const create_date = nowDate.toLocaleString()

    let notes = null
    let close_date = null
    if (order_status === $common.status.waiting) { // 如果设置订单待接取
      notes = 'The order is created by solver_id: ' + solver_id
      solver_id = null
    } else if (order_status === $common.status.receipted) { // 如果设置订单已接取
      notes = 'The order is created and receipted by solver_id: ' + solver_id
    } else if (order_status === $common.status.recorded) { // 如果设置订单已完成
      notes = 'The order is created and finished by solver_id: ' + solver_id
      close_date = create_date
    } else { // 订单状态预料之外
      res.send(false)
    }

    const sqlData = [user_name, user_gender, user_telephone, user_campus, user_dormitory, user_description, solver_record, order_status, order_id, solver_id, create_date, close_date, notes]

    conn.query($sql.order.solver.createOrder, sqlData, (error) => {
      if (error) {
        console.log(error)
        res.send(false)
      } else {
        res.send(true)
      }
    })
  } else {
    res.send(false)
  }
})

/**
 * 获取最近订单状态接口
 * 用户可以创建新订单时返回 true；
 * 用户无法创建新订单时返回 false。
 */
router.post('/getLatestOrderStatus', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const user_id = req.body.user_id
    const checkLatestOrderStatusFlag = await apiUtils.latestOrderStatusCheck(user_id)

    if (checkLatestOrderStatusFlag) {
      res.send(true)
    } else {
      res.send(false)
    }
  }
})

/**
 * 获取最近订单信息接口
 * 返回用户最近的订单信息。
 */
router.post('/getLatestOrderInfo', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const user_id = req.body.user_id
    const latestOrder = await apiUtils.getLatestOrderInfo(user_id)

    if (latestOrder) { // 获取到最近订单信息
      res.send(latestOrder)
    } else { // 用户无最近的订单记录或查询失败
      res.send(false)
    }
  }
})

// 查看历史订单接口

/**
 * 用户取消订单接口
 * 当订单尚未接取时，用户可以取消最近的订单
 */
router.post('/cancelOrderByUser', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const user_id = req.body.user_id
    const order_id = req.body.order_id

    const sqlData = [order_id]
    conn.query($sql.order.queryOrderInfoByOrderId, sqlData, (error, result) => {
      if (error) {
        console.log(error)
        res.send(false)
      } else { // 查询订单信息成功
        if (result.rowCount == 1 && result.rows[0].user_id == user_id) { // 当订单号属于该用户时
          conn.query($sql.order.setOrderStatus, [$common.status.canceledByUser, order_id], (error) => {
            if (error) {
              console.log(error)
              res.send(false)
            } else {
              res.send(true)
            }
          })
        } else { // 订单号不属于该用户
          console.log('order_id not belong to the user.')
          res.send(false)
        }
      }
    })
  } else {
    res.send(false)
  }
})

module.exports = router
