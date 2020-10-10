# netunion-dnrs-web

<div align=center>

  <img src="./client/src/assets/networkOff.jpg" alt="你没网啦？"/>

</div>

## NetUnion Dormitory Network Repair System Web

为**电子科技大学**的学生提供的基于 web 的宿舍网络在线报修系统（平台），支持沙河校区和清水河校区的学生在线报修宿舍网络问题。别担心，宿舍网络问题找我们！

A web-based dormitory network repair system (platform) for students of **University of Electronic Science and Technology**, which supports online report of dormitory network problems for students of Shahe and Qingshuihe campuses. Don't worry, we are the solvers of dormitory network problems.

## Development for frontend

使用本地数据，只进行前端开发。

### Frontend setup

``` node
// client 目录下
npm install
```

### Run frontend server

``` node
// client 目录下
npm run frontend
```

### Log in system

之后您可以：

- 用户组：使用 `user` 作为账号，任意输入密码登录。
- 处理者组：使用 `solver` 作为账号，任意输入密码登录。

## Development for full-stack

使用服务器数据，进行全栈开发。

### Full-stack setup

``` node
// 分别在 client 和 server 目录下
npm install
```

修改 `client/src/main.js` 中（前端）开发者模式为 false

``` js
// client/src/main.js
// 默认为 Vue.prototype.$DevMode = true
// 请勿提交此处修改
Vue.prototype.$DevMode = false
```

### Init PostgreSQL

向项目组成员获取测试数据库登录信息。

### Run server

启动前端网页渲染：

``` node
// client 目录下
npm run frontend
```

启动后端服务器：

``` node
// server 目录下
npm run backend
```

之后您可以：

- 用户组：使用 `2020091202000` 作为账号，`123123` 作为密码登录。
- 处理者组：使用 `2018091202000` 作为账号，`123123` 作为密码登录。

## Compiles and minifies for production

``` node
npm run build
```

## Lints and fixes files

``` node
npm run lint
```
