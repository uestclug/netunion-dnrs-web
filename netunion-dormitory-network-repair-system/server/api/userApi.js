/* eslint-disable camelcase */
/* 用户接口文件 */
const db = require('../db')
const express = require('express')
const router = express.Router()
const pgsql = require('pg')
const utils = require('../utils')
const $sql = require('../sqlMap')
const $common = require('../common')

const conn = new pgsql.Pool(db.pgsql)
conn.connect()

// 用户注册接口

// 用户登录接口
router.post('/login', (req, res) => {
  const input_password = req.body.password
  const token = req.body.token
  const sqlData = [req.body.std_id]

  conn.query($sql.user.getLoginResponse, sqlData, (error, result) => {
    if (error) {
      console.log(error)
      res.send(false)
    } else if (result.rowCount === 1 && input_password === result.rows[0].password) {
      // 更新 token 并返回用户 id 和身份标识
      const id = result.rows[0].id
      const group = result.rows[0].user_group
      updateToken(id, token)
      res.send({
        id: id,
        group: group
      })
    } else {
      res.send(false)
    }
  })
})

function updateToken (id, token) { // 保存登录令牌到数据库
  const expiration_time = 86400000 // 令牌过期时间为 1 天
  const expiration_date = new Date().getTime() + expiration_time
  const sqlData = [token, expiration_date, id]

  conn.query($sql.token.updateToken, sqlData, function (error) {
    if (error) {
      console.log(error)
      return false
    } else {
      return true
    }
  })
}

// 用户 token 验证接口
router.post('/checkToken', async function (req, res) {
  const flag = await utils.checkToken(req)
  if (flag) {
    res.send(true)
  } else {
    res.send(false)
  }
})

// 获取用户资料接口
router.post('/queryUserInfo', async function (req, res) {
  const flag = await utils.checkToken(req)
  if (flag) { // 用户 token 效验成功
    const id = req.body.id
    const sqlData = [id]
    conn.query($sql.user.queryUserInfo, sqlData, (error, result) => {
      if (error) {
        console.log(error)
        res.send(false)
      } else if (result.rowCount === 1) { // 查询到用户结果时
        const userName = result.rows[0].name
        const userGender = result.rows[0].gender
        const userTelephone = result.rows[0].telephone
        const userCampus = result.rows[0].campus
        const userDormitory = result.rows[0].dormitory
        const userStudentId = result.rows[0].std_id
        const response = {
          name: userName,
          gender: userGender,
          telephone: userTelephone,
          campus: userCampus,
          dormitory: userDormitory,
          std_id: userStudentId
        }
        res.send(response)
      } else {
        res.send(false)
      }
    })
  }
})

// 修改用户资料接口
router.post('/modifyAccountInfo', async function (req, res) {
  const flag = await utils.checkToken(req)
  if (flag) {
    const name = req.body.name
    const gender = req.body.gender
    const campus = req.body.campus
    const dormitory = req.body.dormitory
    const telephone = req.body.telephone
    const id = req.body.id
    const sqlData = [name, gender, campus, dormitory, telephone, id]

    conn.query($sql.user.modifyAccountInfo, sqlData, (error) => {
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

// 修改用户密码接口
router.post('/modifyPassword', async function (req, res) {
  const flag = await utils.checkToken(req)
  if (flag) {
    const presentPassword = req.body.presentPassword
    const modifiedPassword = req.body.modifiedPassword
    const id = req.body.id
    const flagData = [id]
    const sqlData = [modifiedPassword, id]

    const loginPasswordResult = await conn.query($sql.user.getLoginPassword, flagData)
    const password = loginPasswordResult.rows[0].password

    if (presentPassword === password) {
      conn.query($sql.user.modifyPassword, sqlData, (error) => {
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

// 用户统计资料接口
router.post('/getUserStatisticsInfo', async function (req, res) {
  const flag = await utils.checkToken(req)
  if (flag) {
    const id = req.body.id
    const sqlMap = [id, $common.status.finished]

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
