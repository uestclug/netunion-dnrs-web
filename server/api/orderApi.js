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
      const create_date = new Date().getTime()
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
    let solver_id = reqBody.user_id
    const order_id = apiUtils.generateOrderId(solver_id) // 根据处理者的 user_id 生成订单号
    const create_date = new Date().getTime()

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
      const solver_id = latestOrder.solver_id
      conn.query($sql.order.querySolverInfo, [solver_id], (error, result) => {
        if (error) {
          console.log(error)
          res.send(false)
        } else {
          latestOrder.order_solver_name = result.rows[0].name
          latestOrder.order_solver_nickname = result.rows[0].nickname
          latestOrder.order_solver_telephone = result.rows[0].telephone
          latestOrder.order_solver_intro = result.rows[0].intro
          latestOrder.create_date = new Date(parseInt(latestOrder.create_date)).toLocaleString()
          latestOrder.close_date = new Date(parseInt(latestOrder.close_date)).toLocaleString()
          res.send(latestOrder)
        }
      }) 
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

    conn.query($sql.order.queryOrderInfoByOrderId, [order_id], (error, result) => {
      if (error) {
        console.log(error)
        res.send(false)
      } else { // 查询订单信息成功
        if (result.rowCount == 1 && result.rows[0].user_id == user_id) { // 当订单号属于该用户时
          const close_date = new Date().getTime()

          conn.query($sql.order.user.closeOrder, [close_date, order_id], (error) => {
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

/**
 * 获取订单总数接口
 */
router.post('/countOrderLength', (req, res) => {
  conn.query($sql.order.countOrderLength, (error, result) => {
    if (error) {
      console.log(error)
      res.send(false)
    } else {
      res.send(result.rows[0].count)
    }
  })
})

/**
 * 处理者获取已接受订单接口
 */
router.post('/queryAcceptedOrder', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const userId = reqBody.user_id
    const sqlData = [userId]

    conn.query($sql.order.solver.queryAcceptedOrder, sqlData, (error, result) => {
      if (error) {
        console.log(error)
        res.send(false)
      } else {
        const orderItems = result.rows
        const min = 60000 // 60 * 1000 ms
        const hour = 3600000 // 60 * 60 * 1000 ms
        const day = 86400000 // 24 * 60 * 60 * 1000 ms
        for (let i = 0; i < orderItems.length; i++) {
          // 若用户名为空，则修改本项
          if (orderItems[i].order_user_name == '') {
            orderItems[i].order_user_name = '[匿名用户]'
          }

          // 若寝室地址为空，则修改本项
          if (orderItems[i].order_user_dormitory == '') {
            orderItems[i].order_user_dormitory = '[未透露寝室地址]'
          }

          // 简化订单用户性别项
          if (orderItems[i].order_user_gender == $common.gender.male) {
            orderItems[i].order_user_gender = '男'
          } else if (orderItems[i].order_user_gender == $common.gender.female) {
            orderItems[i].order_user_gender = '女'
          }

          // 简化订单用户所处校区项
          if (orderItems[i].order_user_campus == $common.campus.qingshuihe) {
            orderItems[i].order_user_campus = '清水河校区'
          } else if (orderItems[i].order_user_campus == $common.campus.shahe) {
            orderItems[i].order_user_campus = '沙河校区'
          }

          // 根据时间计算并添加 order_open_time 项
          const orderOpenTime = new Date().getTime() - orderItems[i].create_date
          if (orderOpenTime < hour) {
            orderItems[i].order_open_time = Math.floor(orderOpenTime / min) + ' min'
          } else if (orderOpenTime < day) {
            orderItems[i].order_open_time = Math.floor(orderOpenTime / hour) + ' hour'
          } else {
            const valueDay = Math.floor(orderOpenTime / day)
            const valueHour = (Math.floor(orderOpenTime / hour) - 24 * valueDay)
            orderItems[i].order_open_time = valueDay + ' d ' + valueHour + ' h'
          }

          // 实例化当前时间
          orderItems[i].create_date = new Date(parseInt(orderItems[i].create_date)).toLocaleString()
        }
        res.send(orderItems)
      }
    })
  } else {
    res.send(false)
  }
})

/**
 * 订单列表获取订单接口
 * 默认每页获取十条订单记录
 */
router.post('/queryOrderList', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const userId = reqBody.user_id
    const page = reqBody.page
    const filter = reqBody.filter
    const limitNum = 10
    const offsetNum = (page - 1) * limitNum
    let sql
    let sqlData

    if (filter === $common.filter.relevant) {
      sql = $sql.order.queryOrderListRelevant
      sqlData = [userId, limitNum, offsetNum]
    } else if (filter === $common.filter.all) {
      sql = $sql.order.queryOrderListAll
      sqlData = [limitNum, offsetNum]
    } else if (filter === $common.filter.available) {
      sql = $sql.order.queryOrderListAvailable
      sqlData = [userId, limitNum, offsetNum]
    }

    conn.query(sql, sqlData, (error, result) => {
      if (error) {
        console.log(error)
        res.send(false)
      } else {
        const orderItems = result.rows
        const min = 60000 // 60 * 1000 ms
        const hour = 3600000 // 60 * 60 * 1000 ms
        const day = 86400000 // 24 * 60 * 60 * 1000 ms
        for (let i = 0; i < orderItems.length; i++) {
          // 添加 is_solver 项
          let is_solver = false
          if (orderItems[i].solver_id == userId) {
            is_solver = true
          }
          orderItems[i].is_solver = is_solver

          // 若用户名为空，则修改本项
          if (orderItems[i].order_user_name == '') {
            orderItems[i].order_user_name = '[未填写]'
          }

          // 简化订单用户性别项
          if (orderItems[i].order_user_gender == $common.gender.male) {
            orderItems[i].order_user_gender = '男'
          } else if (orderItems[i].order_user_gender == $common.gender.female) {
            orderItems[i].order_user_gender = '女'
          }

          // 简化订单用户所处校区项
          if (orderItems[i].order_user_campus == $common.campus.qingshuihe) {
            orderItems[i].order_user_campus = '清水河校区'
          } else if (orderItems[i].order_user_campus == $common.campus.shahe) {
            orderItems[i].order_user_campus = '沙河校区'
          }

          // 根据时间计算并添加 order_open_time 项
          let orderOpenTime = null
          if (orderItems[i].close_date != null) {
            orderOpenTime = orderItems[i].close_date - orderItems[i].create_date
          } else {
            orderOpenTime = new Date().getTime() - orderItems[i].create_date
          }
          if (orderOpenTime < hour) {
            orderItems[i].order_open_time = Math.floor(orderOpenTime / min) + ' min'
          } else if (orderOpenTime < day) {
            orderItems[i].order_open_time = Math.floor(orderOpenTime / hour) + ' hour'
          } else {
            const valueDay = Math.floor(orderOpenTime / day)
            const valueHour = (Math.floor(orderOpenTime / hour) - 24 * valueDay)
            orderItems[i].order_open_time = valueDay + ' d ' + valueHour + ' h'
          }

          // 实例化当前时间
          orderItems[i].create_date = new Date(parseInt(orderItems[i].create_date)).toLocaleString()
          if (orderItems[i].close_date != null) orderItems[i].close_date = new Date(parseInt(orderItems[i].close_date)).toLocaleString()
        }
        res.send(orderItems)
      }
    })
  } else {
    res.send(false)
  }
})

/**
 * 处理者接取订单接口
 */
router.post('/receiptOrder', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const order_id = reqBody.order_id
    const user_id = reqBody.user_id

    const order = await apiUtils.queryOrderInfoByOrderId(order_id)
    if (order !== null) {
      if (order.solver_id == null && order.order_status === $common.status.waiting) {
        const sqlData = [user_id, order_id]
        conn.query($sql.order.solver.receiptOrder, sqlData, (error, result) => {
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
  } else {
    res.send(false)
  }
})

/**
 * 处理者设置订单完成接口
 */
router.post('/finishOrder', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const order_id = reqBody.order_id
    const user_id = reqBody.user_id

    const order = await apiUtils.queryOrderInfoByOrderId(order_id)
    if (order !== null) {
      if (order.solver_id == user_id && order.order_status === $common.status.receipted) {
        const close_date = new Date().getTime()
        const sqlData = [close_date, order_id]
        conn.query($sql.order.solver.finishOrder, sqlData, (error, result) => {
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
  } else {
    res.send(false)
  }
})

/**
 * 重置处理者关闭的订单接口
 */
router.post('/restoreOrder', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const order_id = reqBody.order_id
    const user_id = reqBody.user_id

    const order = await apiUtils.queryOrderInfoByOrderId(order_id)
    if (order !== null) {
      if (order.order_status === $common.status.canceledBySolver) {
        const notes = 'The order is restored by solver_id: ' + user_id
        const sqlData = [notes, order_id]
        conn.query($sql.order.solver.restoreOrder, sqlData, (error, result) => {
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
  } else {
    res.send(false)
  }
})

/**
 * 处理者取消已接取的订单接口
 */
router.post('/cancelOrder', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const order_id = reqBody.order_id
    const user_id = reqBody.user_id

    const order = await apiUtils.queryOrderInfoByOrderId(order_id)
    if (order !== null) {
      if (order.solver_id == user_id && order.order_status === $common.status.receipted) {
        const notes = 'The order is receipted but canceled by solver_id: ' + user_id
        const sqlData = [notes, order_id]
        conn.query($sql.order.solver.cancelOrder, sqlData, (error, result) => {
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
  } else {
    res.send(false)
  }
})

/**
 * 处理者关闭订单接口
 */
router.post('/closeOrder', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const order_id = reqBody.order_id
    const user_id = reqBody.user_id

    const order = await apiUtils.queryOrderInfoByOrderId(order_id)
    if (order !== null) {
      if (order.order_status === $common.status.waiting ||
        (order.solver_id == user_id && order.order_status === $common.status.receipted)) {
        const close_date = new Date().getTime()
        const notes = 'The order is closed by solver_id: ' + user_id
        const sqlData = [close_date, notes, order_id]
        conn.query($sql.order.solver.closeOrder, sqlData, (error, result) => {
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
  } else {
    res.send(false)
  }
})

module.exports = router
