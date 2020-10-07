# netunion-dnrs-web

<div align=center>

  <img src="./src/assets/networkOff.jpg" alt="你没网啦？"/>

</div>

## NetUnion Dormitory Network Repair System Web

为**电子科技大学**的学生提供的宿舍网络在线报修系统（平台），支持沙河校区和清水河校区的学生在线报修宿舍网络问题。

A web-based dormitory network repair system (platform) for students of **University of Electronic Science and Technology**, which supports online report of dormitory network problems for students of Shahe and Qingshuihe campuses.

## Project setup

``` node
// 分别在 client 和 server 目录下
npm install
```

### Run frontend server

``` node
// client 目录下
npm run frontend
```

### Init PostgreSQL & Run backend server

向项目组成员获取测试数据库登录信息。

启动后端服务器：

``` node
// server 目录下
npm run backend
```

之后您可以：

- 用户组：使用 `2020091202000` 作为账号， `123123` 作为密码登录。
- 处理者组：使用 `2018091202000` 作为账号， `123123` 作为密码登录。

### Compiles and minifies for production

``` node
npm run build
```

### Lints and fixes files

``` node
npm run lint
```
