/* eslint-disable camelcase */
/* 订单接口文件 */
const pool = require('../db')
const express = require('express')
const router = express.Router()
// const utils = require('../utils')
const apiUtils = require('./apiUtils')

const $sql = require('../sqlMap')
const $common = require('../../common.js')

/**
 * 用户新建订单接口
 * 当 token 验证成功且用户能够创建订单时访问数据库进行操作。
 */
router.post('/createOrderUser', async function (req, res) {
  const create_date = new Date().getTime()
  const checkTokenFlag = await apiUtils.checkToken(req)
  if (checkTokenFlag) {
    const reqBody = req.body
    const latestOrder = await apiUtils.getLatestOrderInfo(reqBody.user_id)
    const latestOrderStatus = latestOrder.order_status
    if (latestOrderStatus != $common.status.waiting &&
      latestOrderStatus != $common.status.receipted &&
      reqBody.role == $common.role.user) {
      const user_name = reqBody.user_name
      const user_gender = reqBody.user_gender
      const user_telephone = reqBody.user_telephone
      const user_campus = reqBody.user_campus
      const user_dormitory = reqBody.user_dormitory
      const user_description = reqBody.user_description
      const order_status = $common.status.waiting // 设置等待接单
      const user_id = reqBody.user_id
      const order_id = apiUtils.generateOrderId(user_id) // 根据用户的 user_id 等生成订单号
      const sqlData = [user_name, user_gender, user_telephone, user_campus, user_dormitory, user_description, create_date, order_status, order_id, user_id]

      const client = await pool.connect()
      client.query($sql.order.user.createOrder, sqlData, (error) => {
        client.release()
        if (error) {
          console.log(error)
          res.send(false)
        } else {
          apiUtils.addOrderActionNotes(
            order_id, reqBody.user_id, $common.actionNotes.userCreateOrder, create_date
          )
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
 * 用户修改订单信息接口
 */
router.post('/modifyOrderUser', async function (req, res) {
  const modifyDate = new Date().getTime()
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const latestOrder = await apiUtils.getLatestOrderInfo(reqBody.user_id)
    const latestOrderStatus = latestOrder.order_status
    const latestOrderId = latestOrder.order_id
    if (latestOrderId == reqBody.order_id &&
      (latestOrderStatus == $common.status.waiting ||
      latestOrderStatus == $common.status.receipted) &&
      reqBody.role == $common.role.user) {
      const user_name = reqBody.user_name
      const user_gender = reqBody.user_gender
      const user_telephone = reqBody.user_telephone
      const user_campus = reqBody.user_campus
      const user_dormitory = reqBody.user_dormitory
      const user_description = reqBody.user_description
      const sqlData = [latestOrderId, user_name, user_gender, user_telephone, user_campus, user_dormitory, user_description]

      const client = await pool.connect()
      client.query($sql.order.user.modifyOrder, sqlData, (error, result) => {
        client.release()
        if (error) {
          console.log(error)
          res.send(false)
        } else {
          apiUtils.addOrderActionNotes(
            latestOrderId, reqBody.user_id, $common.actionNotes.userModifyOrder, modifyDate
          )
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
  const create_date = new Date().getTime()
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
    let close_date = null
    let action_notes_text = ''

    if (order_status === $common.status.waiting) { // 如果设置订单待接取
      solver_id = null
      action_notes_text = $common.actionNotes.solverCreateOrder
    } else if (order_status === $common.status.receipted) { // 如果设置订单已接取
      action_notes_text = $common.actionNotes.solverCreateAndAcceptOrder
    } else if (order_status === $common.status.recorded) { // 如果设置订单已完成
      close_date = create_date
      action_notes_text = $common.actionNotes.solverRecordOrder
    } else { // 订单状态预料之外
      res.send(false)
    }

    const sqlData = [user_name, user_gender, user_telephone, user_campus, user_dormitory, user_description, solver_record, order_status, order_id, solver_id, create_date, close_date]

    const client = await pool.connect()
    client.query($sql.order.solver.createOrder, sqlData, (error) => {
      client.release()
      if (error) {
        console.log(error)
        res.send(false)
      } else {
        apiUtils.addOrderActionNotes(
          order_id, reqBody.user_id, action_notes_text, create_date
        )
        res.send(true)
      }
    })
  } else {
    res.send(false)
  }
})

/**
 * 处理者修改订单接口
 */
router.post('/modifyOrderSolver', async function (req, res) {
  const modifyDate = new Date().getTime()
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const order_id = reqBody.order_id
    const solver_id = reqBody.user_id
    const user_name = reqBody.user_name
    const user_gender = reqBody.user_gender
    const user_telephone = reqBody.user_telephone
    const user_campus = reqBody.user_campus
    const user_dormitory = reqBody.user_dormitory
    const user_description = reqBody.user_description
    const solver_record = reqBody.solver_record

    const orderInfo = await apiUtils.queryOrderInfoByOrderId(order_id)
    if (orderInfo != null) {
      if (orderInfo.solver_id == solver_id) {
        const sqlData = [order_id, user_name, user_gender, user_telephone, user_campus, user_dormitory, user_description, solver_record]
        const client = await pool.connect()
        client.query($sql.order.solver.modifyOrder, sqlData, (error, result) => {
          client.release()
          if (error) {
            console.log(error)
            res.send(false)
          } else {
            apiUtils.addOrderActionNotes(
              order_id, solver_id, $common.actionNotes.solverModifyOrder, modifyDate
            )
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

      if (solver_id != null && solver_id != '') { // 处理者已接单
        const client = await pool.connect()
        client.query($sql.order.querySolverInfo, [solver_id], (error, result) => {
          client.release()
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
      } else { // 处理者未接单
        latestOrder.create_date = new Date(parseInt(latestOrder.create_date)).toLocaleString()
        res.send(latestOrder)
      }
    } else { // 用户无最近的订单记录或查询失败
      res.send(false)
    }
  } else {
    res.send(false)
  }
})

/**
 * 用户查看历史订单接口
 */
router.post('/queryHistoryOrderByUser', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    // todo
    res.send(true)
  } else {
    res.send(false)
  }
})

/**
 * 用户取消订单接口
 * 当订单尚未接取时，用户可以取消最近的订单
 */
router.post('/cancelOrderByUser', async function (req, res) {
  const close_date = new Date().getTime()
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const user_id = req.body.user_id
    const order_id = req.body.order_id

    const client = await pool.connect()
    client.query($sql.order.queryOrderInfoByOrderId, [order_id], async function (error, result) {
      client.release()
      if (error) {
        console.log(error)
        res.send(false)
      } else { // 查询订单信息成功
        if (result.rowCount == 1 &&
          result.rows[0].user_id == user_id &&
          result.rows[0].order_status == $common.status.waiting) {
          // 当订单号属于该用户且订单尚未接取时

          const client = await pool.connect()
          client.query($sql.order.user.closeOrder, [close_date, order_id], (error) => {
            client.release()
            if (error) {
              console.log(error)
              res.send(false)
            } else {
              apiUtils.addOrderActionNotes(
                order_id, user_id, $common.actionNotes.userCloseOrder, close_date
              )
              res.send(true)
            }
          })
        } else { // 订单号不属于该用户
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
router.post('/countOrderLength', async function (req, res) {
  const client = await pool.connect()
  client.query($sql.order.countOrderLength, (error, result) => {
    client.release()
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

    const client = await pool.connect()
    client.query($sql.order.solver.queryAcceptedOrder, sqlData, (error, result) => {
      client.release()
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

    const client = await pool.connect()
    client.query(sql, sqlData, async function (error, result) {
      client.release()
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
            orderItems[i].order_user_name = '[匿名用户]'
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
          if (orderItems[i].order_status != $common.status.recorded) {
            let orderOpenTime
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
          } else {
            orderItems[i].order_open_time = '-'
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
    if (order) {
      if (order.solver_id == null && order.order_status === $common.status.waiting) {
        const sqlData = [user_id, order_id]
        const client = await pool.connect()
        client.query($sql.order.solver.receiptOrder, sqlData, (error, result) => {
          client.release()
          if (error) {
            console.log(error)
            res.send(false)
          } else {
            apiUtils.addOrderActionNotes(
              order_id, user_id, $common.actionNotes.solverAcceptOrder, null
            )
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
  const close_date = new Date().getTime()
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const order_id = reqBody.order_id
    const user_id = reqBody.user_id

    const order = await apiUtils.queryOrderInfoByOrderId(order_id)
    if (order !== null) {
      if (order.solver_id == user_id && order.order_status === $common.status.receipted) {
        const sqlData = [close_date, order_id]
        const client = await pool.connect()
        client.query($sql.order.solver.finishOrder, sqlData, (error, result) => {
          client.release()
          if (error) {
            console.log(error)
            res.send(false)
          } else {
            apiUtils.addOrderActionNotes(
              order_id, user_id, $common.actionNotes.solverFinishOrder, close_date
            )
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
        const sqlData = [order_id]
        const client = await pool.connect()
        client.query($sql.order.solver.restoreOrder, sqlData, (error, result) => {
          client.release()
          if (error) {
            console.log(error)
            res.send(false)
          } else {
            apiUtils.addOrderActionNotes(
              order_id, user_id, $common.actionNotes.solverRestoreOrder, null
            )
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
        const sqlData = [order_id]
        const client = await pool.connect()
        client.query($sql.order.solver.cancelOrder, sqlData, (error, result) => {
          if (error) {
            console.log(error)
            client.release()
            res.send(false)
          } else {
            apiUtils.addOrderActionNotes(
              order_id, user_id, $common.actionNotes.solverCancelOrder, null
            )
            client.query($sql.order.assignee.removeAllAssignee, [order_id], (error, result) => {
              client.release()
              if (error) {
                console.log(error)
                res.send(false)
              } else {
                res.send(true)
              }
            })
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
  const close_date = new Date().getTime()
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const order_id = reqBody.order_id
    const user_id = reqBody.user_id

    const order = await apiUtils.queryOrderInfoByOrderId(order_id)
    if (order !== null) {
      if (order.order_status === $common.status.waiting ||
        (order.solver_id == user_id && order.order_status === $common.status.receipted)) {
        const sqlData = [close_date, order_id]
        const client = await pool.connect()
        client.query($sql.order.solver.closeOrder, sqlData, (error, result) => {
          if (error) {
            console.log(error)
            client.release()
            res.send(false)
          } else {
            apiUtils.addOrderActionNotes(
              order_id, user_id, $common.actionNotes.solverCloseOrder, close_date
            )
            client.query($sql.order.assignee.removeAllAssignee, [order_id], (error, result) => {
              client.release()
              if (error) {
                console.log(error)
                res.send(false)
              } else {
                res.send(true)
              }
            })
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
 * 查询订单出勤记录信息接口
 */
router.post('/queryAttendance', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const order_id = req.body.order_id

    const client = await pool.connect()
    client.query($sql.order.attendance.queryAttendanceInfo, [order_id], (error, result) => {
      client.release()
      if (error) {
        console.log(error)
        res.send(false)
      } else {
        for (let i = 0; i < result.rowCount; i++) {
          result.rows[i].attn_date = new Date(parseInt(result.rows[i].attn_date)).toLocaleString()
        }
        res.send(result.rows)
      }
    })
  } else {
    res.send(false)
  }
})

/**
 * 处理者添加出勤记录接口
 */
router.post('/addAttendance', async function (req, res) {
  const attn_date = new Date().getTime()
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    if (!reqBody.is_solver) { // 操作者应为处理者
      res.send(false)
    }

    const order_id = reqBody.order_id
    const solver_id = reqBody.user_id
    const attn_description = reqBody.attn_description
    const sqlData = [order_id, solver_id, attn_description, attn_date]

    const client = await pool.connect()
    client.query($sql.order.attendance.addAttendance, sqlData, (error, result) => {
      client.release()
      if (error) {
        console.log(error)
        res.send(false)
      } else {
        apiUtils.addOrderActionNotes(
          order_id, solver_id, $common.actionNotes.solverAddAttn, attn_date
        )

        // 返回添加的出勤信息进行前端渲染
        const attn_date_frontend = new Date(attn_date).toLocaleString()
        const solver_name = reqBody.solver_name
        res.send(
          {
            order_id: order_id,
            solver_id: solver_id,
            solver_name: solver_name,
            attn_description: attn_description,
            attn_date: attn_date_frontend
          }
        )
      }
    })
  } else {
    res.send(false)
  }
})

/**
 * 查询订单协作者信息接口
 */
router.post('/queryAssignee', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const order_id = req.body.order_id

    const client = await pool.connect()
    client.query($sql.order.assignee.queryAssigneeInfo, [order_id], (error, result) => {
      client.release()
      if (error) {
        console.log(error)
        res.send(false)
      } else {
        res.send(result.rows)
      }
    })
  } else {
    res.send(false)
  }
})

/**
 * 处理者添加订单协作者接口
 */
router.post('/addAssignee', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  const reqBody = req.body
  if (flag && reqBody.is_solver) {
    const order_id = reqBody.order_id
    const assignee_id = reqBody.assignee_id
    const assignee_name = reqBody.assignee_name
    const sqlData = [order_id, assignee_id]

    const client = await pool.connect()
    client.query($sql.order.assignee.addAssignee, sqlData, (error, result) => {
      client.release()
      if (error) {
        console.log(error)
        res.send(false)
      } else {
        apiUtils.addOrderActionNotes(
          order_id, reqBody.user_id, $common.actionNotes.solverAddAsgn + ' ' + assignee_name, null
        )
        res.send(true)
      }
    })
  } else {
    res.send(false)
  }
})

/**
 * 处理者移除订单协作者接口
 */
router.post('/removeAssignee', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const order_id = reqBody.order_id
    const assignee_id = reqBody.assignee_id
    const assignee_name = reqBody.assignee_name
    const sqlData = [order_id, assignee_id]

    const client = await pool.connect()
    client.query($sql.order.assignee.removeAssignee, sqlData, (error, result) => {
      client.release()
      if (error) {
        console.log(error)
        res.send(false)
      } else {
        apiUtils.addOrderActionNotes(
          order_id, reqBody.user_id, $common.actionNotes.solverRemoveAsgn + ' ' + assignee_name, null
        )
        res.send(true)
      }
    })
  } else {
    res.send(false)
  }
})

/**
 * 处理者查询订单操作记录接口
 */
router.post('/queryOrderActionNotes', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const sqlData = [req.body.order_id]

    const client = await pool.connect()
    client.query($sql.order.actionNotes.queryActionNotesByOrderId, sqlData, (error, result) => {
      client.release()
      if (error) {
        console.log(error)
        res.send(false)
      } else {
        for (let i = 0; i < result.rowCount; i++) {
          result.rows[i].action_date = new Date(parseInt(result.rows[i].action_date)).toLocaleString()
        }
        res.send(result.rows)
      }
    })
  } else {
    res.send(false)
  }
})

module.exports = router
