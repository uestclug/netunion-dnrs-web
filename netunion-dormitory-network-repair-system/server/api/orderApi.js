/* 订单接口文件 */
const db = require("../db");
const express = require("express");
const router = express.Router();
const pgsql = require("pg");
const utils = require("../utils");
const $sql = require("../sqlMap");

const conn = pgsql.Pool(db.pgsql);
conn.connect();

// 新建订单接口

// 接受订单接口

// 获取订单信息接口

// 查看历史订单接口

// 修改订单信息接口

// 删除订单接口

module.exports = router;