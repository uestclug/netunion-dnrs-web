const db = require("../db");
const express = require("express");
const router = express.Router();
const pgsql = require("pg");
const utils = require("../utils");
const $sql = require("../sqlMap");

const conn = pgsql.Pool(db.pgsql);
conn.connect();

// 添加操作日志接口

// 读取操作日志接口

module.exports = router;