/* eslint-disable camelcase */
/* api 公用函数 */
const md5 = require('js-md5')

const pool = require('../db')
const utils = require('../utils')
const Base64 = require('js-base64').Base64

const $sql = require('../sqlMap')
const $common = require('../../common.js')

/**
 * 获取用户最近的订单信息
 * 用户存在最近订单时返回最近订单的信息；
 * 不存在或查询失败时返回 false。
 */
async function getLatestOrderInfo (user_id) {
  const sqlData = [user_id]

  const client = await pool.connect()
  const response = await client.query($sql.order.user.queryOrderInfoByUserId, sqlData)
  client.release()
  const orderNum = response.rowCount
  if (orderNum != null && orderNum > 0) { // 用户有最近的订单记录，返回最近订单信息
    return response.rows[0]
  } else { // 用户无最近的订单记录或查询失败
    return false
  }
}

/**
 * 生成随机订单号
 * 通过当前时间和 user_id 和随机数拼接成随机订单号。
 */
function generateOrderId (userId) {
  const nowDate = new Date()
  const year = nowDate.getFullYear()
  const month = utils.prefixZero(nowDate.getMonth() + 1, 2)
  const day = utils.prefixZero(nowDate.getDate(), 2)
  const hour = utils.prefixZero(nowDate.getHours(), 2)
  const min = utils.prefixZero(nowDate.getMinutes(), 2)
  const second = utils.prefixZero(nowDate.getSeconds(), 2)
  // user_id 值小于 1000000
  const user_id = utils.prefixZero(userId, 6)
  // 生成介于 0-100000 的随机数
  const random = utils.prefixZero(Math.floor(Math.random() * 100), 3)
  return user_id + month + day + hour + min + second + year + random
}

/**
 * 验证用户 token 是否有效
 * 当用户的 token 存在且未过期，且 role 正确时返回 true；
 * 其它情况返回 false。
 */
async function checkToken (req) { // 用户 token 验证
  const nowDate = new Date().getTime()
  const reqBody = req.body
  const user_id = reqBody.user_id // 从请求体获取 user_id
  const role = reqBody.role
  const token = req.headers.authorization // 从请求头获取 token
  const sqlData = [user_id]

  const client = await pool.connect()
  const response = await client.query($sql.token.getTokenAndRole, sqlData)
  client.release()
  if (response.rowCount === 1) { // 数据库包含该 uesr_id 对应的 token 信息
    const resData = response.rows[0]
    const savedToken = resData.token
    const savedExpirationDate = resData.expiration_date
    const savedRole = resData.role
    if (token === savedToken && nowDate < savedExpirationDate && role === savedRole) { // 数据库保存的 token 与 localStorage 存储相同且 token 未过期，用户组正确
      return true
    } else {
      return false
    }
  } else { // 数据库无该 user_id 结果
    return false
  }
}

/**
 * 生成随机的 token 令牌
 * 通过对日期和随机数拼接所得值进行加密获得 token 令牌。
 */
function generateToken () {
  const unscrambleToken = new Date().getTime().toString() + Math.floor(Math.random() * 10000 + 1).toString()
  const token = md5(Base64.encode(unscrambleToken))
  return token
}

/**
 * 将传入的密码进行加密
 * 返回加密后的密码
 */
function generateEncryptedPassword (password) {
  return md5(Base64.encode(password))
}

/**
 * 设置数据库中的 token 信息
 * 将用户的登录信息存储到数据库中
 */
async function setToken (user_id, token, expiration_date) {
  const sqlData = [token, expiration_date, user_id]

  const client = await pool.connect()
  client.query($sql.token.setToken, sqlData, (error) => {
    client.release()
    if (error) {
      console.log(error)
      return false
    } else {
      return true
    }
  })
}

/**
 * 获取订单信息
 */
async function queryOrderInfoByOrderId (order_id) {
  const sqlData = [order_id]

  const client = await pool.connect()
  const response = await client.query($sql.order.queryOrderInfoByOrderId, sqlData)
  client.release()

  if (response.rowCount && response.rowCount === 1) return response.rows[0]
  else return null
}

/**
 * 添加订单操作记录
 */
async function addOrderActionNotes (order_id, user_id, notes_text, action_date) {
  if (action_date == null) action_date = new Date().getTime()
  const sqlData = [order_id, user_id, notes_text, action_date]

  const client = await pool.connect()
  client.query($sql.order.actionNotes.addActionNotes, sqlData, (error, result) => {
    client.release()
    if (error) {
      console.log(error)
      return false
    } else {
      return true
    }
  })
}

module.exports = {
  getLatestOrderInfo,
  generateOrderId,
  checkToken,
  generateToken,
  generateEncryptedPassword,
  setToken,
  queryOrderInfoByOrderId,
  addOrderActionNotes
}
