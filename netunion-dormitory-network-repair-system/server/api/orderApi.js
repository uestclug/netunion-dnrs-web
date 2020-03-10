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

// 获取用户最近的订单号
async function getLatestOrderId(user_id) {
  const sqlData = [user_id]

  const response = await conn.query($sql.order.queryLatestOrderIdByUserId, sqlData)
  if (response.rowCount == 1) { // 用户有最近的订单记录
    // 返回订单号
    return response.rows[0].max
  } else { // 用户无最近的订单记录
    return false
  }
}

// 用户新建订单接口
router.post('/createOrder', (req, res) => {
  const body = req.body
  const user_name = body.user_name
  const user_gender = body.user_gender
  const user_telephone = body.user_telephone
  const user_campus = body.user_campus
  const user_dormitory = body.user_dormitory
  const user_description = body.user_description
  const order_status = $common.status.waiting // 设置等待接单
  const nowDate = new Date()
  const user_id = body.user_id
  const order_id = nowDate.getTime() + user_id // 以当前时间和 user_id 形成订单号
  const order_date = nowDate.toLocaleString()
  const solver_name = null // 设置接单人为空
  const sqlData = [user_name, user_gender, user_telephone, user_campus, user_dormitory, user_description, order_date, order_status, order_id, solver_name, user_id]

  conn.query($sql.order.createOrder, sqlData, (error) => {
    if (error) {
      console.log(error)
      res.send(false)
    } else {
      const result = {
        order_user_dormitory: user_dormitory,
        order_status: order_status,
        order_user_name: user_name,
        order_user_campus: user_campus,
        order_user_telephone: user_telephone,
        order_user_description: user_description,
        order_date: order_date,
        order_id: order_id,
        order_solver_name: '-',
        order_solver_telephone: '-',
        order_solver_intro: '-',
        order_solver_nickname: '-'
      }
      res.send(result)
    }
  })
})

// 接受订单接口

// 获取最近订单状态接口
router.post('/getLatestOrderStatus', async function (req, res) {
  const user_id = req.body.user_id
  const latestOrderId = await getLatestOrderId(user_id)
  if (latestOrderId) { // 如果获取到最近的订单
    const sqlData = [latestOrderId]

    conn.query($sql.order.queryOrderInfoByOrderId, sqlData, (error, result) => {
      if (error) {
        console.log(error)
        res.send(false)
      } else {
        res.send(result.rows[0].order_status)
      }
    })
  } else { // 无过去的订单（首次下单）
    res.send(true)
  }
})

// 获取最近订单信息接口
router.post('/getLatestOrderInfo', async function (req, res) {
  const user_id = req.body.user_id
  const latestOrderId = await getLatestOrderId(user_id)
  if (latestOrderId) { // 如果获取到最近的订单
    const sqlData = [latestOrderId]

    conn.query($sql.order.queryOrderInfoByOrderId, sqlData, (error, result) => {
      if (error) {
        console.log(error)
        res.send(false)
      } else {
        const orderInfo = result.rows[0]
        if (orderInfo.order_solver_id !== null) { // 当存在 Solver 时
          conn.query($sql.order.querySolverInfo, [orderInfo.order_solver_id], (error, result) => {
            if (error) {
              console.log(error)
              res.send(false)
            } else {
              const resultBody = result.rows[0]
              const orderSolverInfo = {
                order_solver_name: resultBody.name,
                order_solver_telephone: resultBody.telephone,
                order_solver_intro: resultBody.intro,
                order_solver_nickname: resultBody.nickname
              }
              const orderFullInfo = Object.assign(orderInfo, orderSolverInfo) // 合并 order 信息和 solver 信息
              res.send(orderFullInfo)
            }
          })
        } else { // 无人接单时
          res.send(orderInfo)
        }
      }
    })
  } else { // 无过去的订单（首次下单）
    res.send(false)
  }
})

// 查看历史订单接口

// 修改订单信息接口

// 删除订单接口

module.exports = router