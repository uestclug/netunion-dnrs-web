const aboutApi = require('./api/aboutApi')
const logApi = require('./api/logApi')
const orderApi = require('./api/orderApi')
const tokenApi = require('./api/tokenApi')
const userApi = require('./api/userApi')
const bodyParser = require('body-parser')
const express = require('express')

const app = express()
const port = 8088

// 设置 bodyParser 中间件用于 express 的 post 请求
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// 设置跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
  res.header('Access-Control-Allow-Methods', 'POST,GET')
  res.header('Access-Control-Expose-Headers', 'Authorization')
  next()
})

// 添加 api 路由
app.use('/api/about', aboutApi)
app.use('/api/log', logApi)
app.use('/api/order', orderApi)
app.use('/api/token', tokenApi)
app.use('/api/user', userApi)

// 监听端口
app.listen(port, () => console.log(`listening on port: ${port}`))
