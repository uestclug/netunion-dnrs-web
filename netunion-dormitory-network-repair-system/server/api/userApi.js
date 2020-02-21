// 用户资料数据库 api
var model = require('../dataBase')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sqlMap = require('../sqlMap')

// 连接数据库
var conn = mysql.createConnection(model.mysql)
conn.connect()

// 用户注册接口


// 用户登录接口


module.exports = router
