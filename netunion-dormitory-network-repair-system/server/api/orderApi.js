/* eslint-disable camelcase */
/* 订单接口文件 */
const db = require('../db')
const express = require('express')
const router = express.Router()
const pgsql = require('pg')
const utils = require('../utils')
const $sql = require('../sqlMap')
const $common = require('../common')

const conn = new pgsql.Pool(db.pgsql)
conn.connect()

// 获取用户最近的订单号
async function getLatestOrderId (user_id) {
  const sqlData = [user_id]

  const response = await conn.query($sql.order.queryOrderInfoByUserId, sqlData)
  const orderNum = response.rowCount
  if (orderNum != 0) { // 用户有最近的订单记录
    return response.rows[orderNum - 1].order_id
  } else { // 用户无最近的订单记录
    return false
  }
}

// 生成订单号
function generateOrderId (nowDate, userId) {
  const year = nowDate.getFullYear()
  const month = utils.prefixZero(nowDate.getMonth() + 1, 2)
  const day = utils.prefixZero(nowDate.getDate(), 2)
  const hour = utils.prefixZero(nowDate.getHours(), 2)
  const min = utils.prefixZero(nowDate.getMinutes(), 2)
  const second = utils.prefixZero(nowDate.getSeconds(), 2)
  // user_id 值小于 1000000
  const id = utils.prefixZero(userId, 6)
  // 生成介于 0-100000 的随机数
  const random = utils.prefixZero(Math.floor(Math.random() * 100), 3)
  return id + month + day + hour + min + second + year + random
}

// 用户新建订单接口
router.post('/createOrder', async function (req, res) {
  const flag = await utils.checkToken(req)
  if (flag) {
    const body = req.body
    const user_name = body.user_name
    const user_gender = body.user_gender
    const user_telephone = body.user_telephone
    const user_campus = body.user_campus
    const user_dormitory = body.user_dormitory
    const user_description = body.user_description
    const order_status = $common.status.waiting // 设置等待接单
    const nowDate = new Date()
    const user_id = body.id
    const order_id = generateOrderId(nowDate, user_id) // 生成订单号
    const order_date = nowDate.toLocaleString()
    const solver_name = null // 设置接单人为空
    const sqlData = [user_name, user_gender, user_telephone, user_campus, user_dormitory, user_description, order_date, order_status, order_id, solver_name, user_id]

    const latestOrderId = await getLatestOrderId(user_id)
    if (latestOrderId) { // 存在最近订单，验证订单状态
      conn.query($sql.order.queryOrderInfoByOrderId, [latestOrderId], (error, result) => {
        if (error) {
          console.log(error)
          res.send(false)
        } else {
          const status = result.rows[0].order_status
          if (status == $common.status.waiting || status == $common.status.receipted) { // 避免提交重复订单
            res.send(false)
          } else {
            conn.query($sql.order.createOrder, sqlData, (error) => {
              if (error) {
                console.log(error)
                res.send(false)
              } else {
                res.send(true)
              }
            })
          }
        }
      })
    } else { // 不存在最近订单时（首次下单）
      conn.query($sql.order.createOrder, sqlData, (error) => {
        if (error) {
          console.log(error)
          res.send(false)
        } else {
          res.send(true)
        }
      })
    }
  } else {
    res.send(false)
  }  
})

// 接受订单接口

// 获取最近订单状态接口
router.post('/getLatestOrderStatus', async function (req, res) {
  const flag = utils.checkToken(req)
  if (flag) {
    const user_id = req.body.id
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
  } else {
    res.send(false)
  }  
})

// 获取最近订单信息接口
router.post('/getLatestOrderInfo', async function (req, res) {
  const flag = utils.checkToken(req)
  if (flag) {
    const user_id = req.body.id
    const latestOrderId = await getLatestOrderId(user_id)
    if (latestOrderId) { // 如果获取到最近的订单
      const sqlData = [latestOrderId]

      conn.query($sql.order.queryOrderInfoByOrderId, sqlData, (error, result) => {
        if (error) {
          console.log(error)
          res.send(false)
        } else {
          const orderInfo = result.rows[0]
          if (orderInfo.order_solver_id != null) { // 当存在 Solver 时
            conn.query($sql.order.querySolverInfo, [orderInfo.order_solver_id], (error, result) => {
              if (error) { // 检索失败时仅返回订单信息
                console.log(error)
                res.send(orderInfo)
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
  } else {
    res.send(false)
  }  
})

// 查看历史订单接口

// 删除订单接口
router.post('/cancelOrderByUser', async function (req, res) {
  const flag = await utils.checkToken(req)
  if (flag) {
    const user_id = req.body.id
    const order_id = req.body.order_id

    const sqlData = [order_id]
    conn.query($sql.order.queryOrderInfoByOrderId, sqlData, (error, result) => {
      if (error) {
        console.log(error)
        res.send(false)
      } else {
        if (result.rows[0].order_user_id == user_id) { // 当订单号属于该用户时
          conn.query($sql.order.setOrderStatus, [$common.status.canceledByUser, order_id], (error) => {
            if (error) {
              console.log(error)
              res.send(false)
            } else {
              res.send(true)
            }
          })
        } else {
          console.log('false')
          res.send(false)
        }
      }
    })
  } else {
    res.send(false)
  }  
})

module.exports = router
