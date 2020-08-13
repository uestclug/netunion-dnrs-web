/* eslint-disable camelcase */
/* 用户接口文件 */
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

// todo: 用户注册接口
router.post('/register', (req, res) => {
  const reqBody = req.body
  console.log(reqBody)
  res.send(false)
})

/**
 * 用户登录接口
 */
router.post('/login', (req, res) => {
  const reqBody = req.body
  const std_id = reqBody.std_id
  const password = reqBody.password
  const sqlData = [std_id]

  conn.query($sql.account.getLoginResponse, sqlData, (error, result) => {
    if (error) {
      console.log(error)
      res.send(false)
    } else if (result.rowCount === 1 && password === result.rows[0].password) {
      const user_id = result.rows[0].user_id
      const role = result.rows[0].role
      const token = apiUtils.generateToken()
      const expiration_time = 604800000 // 令牌过期时间为 7 天
      const expiration_date = new Date().getTime() + expiration_time
      apiUtils.setToken(user_id, token, expiration_date)
      res.send({
        user_id: user_id,
        role: role,
        token: token
      })
    } else { // 未检索到信息或密码错误
      res.send(false)
    }
  })
})

/**
 * 登录成功时获取用户资料接口
 */
router.post('/queryUserInfo', async function (req, res) {
  const user_id = req.body.user_id
  const sqlData = [user_id]
  conn.query($sql.account.queryUserInfo, sqlData, (error, result) => {
    if (error) {
      console.log(error)
      res.send(false)
    } else if (result.rowCount === 1) { // 查询到用户结果时
      const name = result.rows[0].name
      const gender = result.rows[0].gender
      const telephone = result.rows[0].telephone
      const campus = result.rows[0].campus
      const dormitory = result.rows[0].dormitory
      const response = {
        name: name,
        gender: gender,
        telephone: telephone,
        campus: campus,
        dormitory: dormitory
      }
      res.send(response)
    } else { // 未查询到用户结果
      res.send(false)
    }
  })
})

/**
 * 修改 user 用户组用户资料接口
 */
router.post('/modifyUserAccountInfo', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const name = reqBody.name
    const gender = reqBody.gender
    const campus = reqBody.campus
    const dormitory = reqBody.dormitory
    const telephone = reqBody.telephone
    const user_id = reqBody.user_id
    const sqlData = [name, gender, campus, dormitory, telephone, user_id]

    conn.query($sql.account.user.modifyAccountInfo, sqlData, (error, result) => {
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
 * 修改用户密码接口
 */
router.post('/modifyPassword', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const presentPassword = req.body.presentPassword
    const modifiedPassword = req.body.modifiedPassword
    const user_id = req.body.user_id
    const flagData = [user_id]
    const sqlData = [modifiedPassword, user_id]

    const loginPasswordResult = await conn.query($sql.account.getLoginPassword, flagData)
    if (presentPassword === loginPasswordResult.rows[0].password) {
      conn.query($sql.account.modifyPassword, sqlData, (error) => {
        if (error) {
          console.log(error)
          res.send(false)
        } else {
          res.send(true)
        }
      })
    } else { // 输入的密码和数据库密码不同时
      res.send($common.password.presentErr)
    }
  } else {
    res.send(false)
  }
})

/**
 * 获取用户统计资料接口
 */
router.post('/getUserStatisticsInfo', async function (req, res) {
  const flag = await apiUtils.checkToken(req)
  if (flag) {
    const reqBody = req.body
    const user_id = reqBody.user_id
    const sqlMap = [user_id, $common.status.finished]

    conn.query($sql.order.getSelectedOrder, sqlMap, async function (error, result) {
      if (error) {
        console.log(error)
        res.send(false)
      } else {
        const finished_order_time = result.rowCount
        let first_finished_order_date = '-'
        let first_finished_order_solver_name = '-'
        let latest_finished_order_date = '-'
        let latest_finished_order_solver_name = '-'
        // let unlocked_solver_num = 0
        // let best_solver = '-'
        // let best_solver_time = 0
        if (finished_order_time !== 0) { // 存在历史完成订单记录时
          const first_finished_order_solver_id = result[0].order_solver_id
          const first_finished_order_solver = await conn.query($sql.solver.querySolverInfo, [first_finished_order_solver_id])
          first_finished_order_solver_name = first_finished_order_solver.rows[0].name
          first_finished_order_date = result[0].order_date
          const latest_finished_order_solver_id = result[finished_order_time - 1].order_solver_id
          const latest_finished_order_solver = await conn.query($sql.solver.querySolverInfo, [latest_finished_order_solver_id])
          latest_finished_order_solver_name = latest_finished_order_solver.rows[0].name
          latest_finished_order_date = result[finished_order_time - 1].order_date
        }
        const response = {
          finished_order_time: finished_order_time,
          first_finished_order_date: first_finished_order_date,
          first_finished_order_solver_name: first_finished_order_solver_name,
          latest_finished_order_date: latest_finished_order_date,
          latest_finished_order_solver_name: latest_finished_order_solver_name
          // unlocked_solver_num: unlocked_solver_num,
          // best_solver: best_solver,
          // best_solver_time: best_solver_time
        }
        res.send(response)
      }
    })
  } else {
    res.send(false)
  }
})

module.exports = router
