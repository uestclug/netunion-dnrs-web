// 订单资料数据库 api
var model = require('../dataBase')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sqlMap = require('../sqlMap')

// 连接数据库
var conn = mysql.createConnection(model.mysql)
conn.connect()

// （学生/运维部）添加订单接口


// （运维部）接受订单接口


// （学生/运维部）显示历史订单接口


// （运维部）设置订单完成接口


// （学生/运维部）取消订单接口


module.exports = router
