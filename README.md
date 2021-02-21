# netunion-dnrs-web

<div align=center><img src="./src/assets/networkOff.jpg" alt="你没网啦？" /></div>

## NetUnion Dormitory Network Repair System Web

为**电子科技大学**的学生提供的基于 web 的宿舍网络在线报修系统（平台），支持沙河校区和清水河校区的学生在线报修宿舍网络问题。别担心，宿舍网络问题找我们！

A web-based dormitory network repair system (platform) for students of **University of Electronic Science and Technology**, which supports online report of dormitory network problems for students of Shahe and Qingshuihe campuses. Don't worry, we are the solvers of dormitory network problems.

## Frontend development / 前端开发

Front-end development using pre-defined data.

``` shell
npm install
```

### Run frontend serve / 启动基于预设数据的前端渲染

``` shell
npm run frontend
```

### Log in system / 登录到系统

Then you can log in to the system under two different identities.

- **User**: Use `user` as username and enter any password to log in.
- **Solver**: Use `solver` as username and enter any password to log in.

## Full stack development / 全栈开发

<details>

<summary>Use server data for full-stack development.</summary>

<br />

``` shell
npm install
```

### Setup backend server / 启动后端服务器

Go to project [netunion-dnrs-backend](https://github.com/uestclug/netunion-dnrs-backend) and start the backend server.

### Run full stack serve / 启动前端渲染

``` shell
npm run fullstack
```

### Log in system with server / 经服务器验证登录到系统

Ask system login information from project team members.

</details>

## Compiles and minifies for production / 生产环境编译打包

``` shell
npm run build
```

## Lints and fixes files / 格式化代码

``` shell
npm run lint
```

## Version / 版本号

Year.Month-B(eta)/S(table) (Number)

Example:

``` none
// .env
VUE_APP_VERSION_CODE=20.10-S2
```

Want to know more about version update log, see [CHANGELOG.md](./CHANGELOG.md).
