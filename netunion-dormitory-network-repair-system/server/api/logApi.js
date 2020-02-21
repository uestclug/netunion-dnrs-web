// 操作日志数据库 api
var model = require('../dataBase')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sqlMap = require('../sqlMap')

// 连接数据库
var conn = mysql.createConnection(model.mysql)
conn.connect()

// 存储操作日志接口


// 读取操作日志接口


module.exports = router
