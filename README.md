# netunion-dnrs-web

<div align=center><img src="./client/src/assets/networkOff.jpg" alt="你没网啦？" /></div>

## NetUnion Dormitory Network Repair System Web

为**电子科技大学**的学生提供的基于 web 的宿舍网络在线报修系统（平台），支持沙河校区和清水河校区的学生在线报修宿舍网络问题。别担心，宿舍网络问题找我们！

A web-based dormitory network repair system (platform) for students of **University of Electronic Science and Technology**, which supports online report of dormitory network problems for students of Shahe and Qingshuihe campuses. Don't worry, we are the solvers of dormitory network problems.

## Development for frontend

使用本地数据，只进行前端开发。

``` shell
npm install
```

### Run frontend serve

``` shell
npm run frontend
```

### Log in system

之后您可以：

- 用户组：使用 `user` 作为账号，任意输入密码登录。
- 处理者组：使用 `solver` 作为账号，任意输入密码登录。

## Development for full-stack

<details>

<summary>使用服务器数据，进行全栈开发。</summary>

``` shell
npm install
```

### Full-stack setup

移步到项目 [netunion-dnrs-backend](https://github.com/uestclug/netunion-dnrs-backend) 启动后端服务器。

### Disable frontend devmode

修改 `src/main.js` 中前端开发者模式为 false

``` js
// client/src/main.js
// 默认为 Vue.prototype.$DevMode = true
// 请勿提交此处修改
Vue.prototype.$DevMode = false
```

### Run frontend serve

启动前端网页渲染：

``` shell
npm run frontend
```

### Log in system

向项目组成员获取系统登录信息。

</details>

## Compiles and minifies for production

``` shell
npm run build
```

## Lints and fixes files

``` shell
npm run lint
```

## Version

Year.Month-B(eta)/S(table) (Number)

Example:

``` js
// .env
VUE_APP_VERSION_CODE=20.10-S2
```

Want to know more about version update log, see [CHANGELOG.md](./CHANGELOG.md).
