// 配置后端服务器和 api 路由
const logApi = require('./api/logApi')
const orderApi = require('./api/orderApi')
const userApi = require('./api/userApi')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const localPort = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('api/logApi', logApi)
app.use('api/orderApi', orderApi)
app.use('api/userApi', userApi)

app.listen(localPort, () => {
  console.log('Listen at: %s:%s', host, port)
})
