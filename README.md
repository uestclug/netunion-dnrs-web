# netunion-dormitory-network-repair-system

<div align=center>

  NetUnion - 电子科技大学 | 宿舍网络在线报修平台

  <img src="./src/assets/networkOff.jpg" alt="你没网啦？"/>

</div>

## Project setup

``` node
// 根目录下
npm install

// server 目录下
npm install
```

### Init PostgreSQL & Run backend server

根据 ./server/db.js 创建 PostgreSQL 数据库登录账号信息。

还原测试用备份文件 ./server/netunion_dnrs_sql .

启动后端服务器：

``` node
// 根目录下
npm run backend

// 或者 server 目录下
node index.js
```

之后您可以：

- 用户组：使用 `2020091202000` 作为账号， `123123` 作为密码登录。
- 处理者组：使用 `2018091202000` 作为账号， `123123` 作为密码登录。

### Compiles and hot-reloads for development

``` node
npm run serve
```

### Compiles and minifies for production

``` node
npm run build
```

### Lints and fixes files

``` node
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## TO DO LIST

基于 [VUE2](https://cn.vuejs.org/) 和 [Express](http://www.expressjs.com.cn/) 开发框架进行设计开发。

### 前端

- **界面设计**

  采用 [Vuetify](https://vuetifyjs.com/zh-Hans/) 组件框架；

  不同的用户应有不同的页面设计和操作按钮，Vue动态加载页面，根据不同用户跳转不同页面。

  - [x] “登录”页面
  - [x] 学生“主页”页面
  - [x] 学生“账户”页面
  - [x] 学生“订单”页面
  - [x] 学生“关于我们”页面
  - [x] NetUnion成员“主页”页面
  - [x] NetUnion成员“账户”页面
  - [x] NetUnion成员“订单”页面
  - [x] NetUnion成员“关于我们”页面

- **语言支持**

  采用 [vue-i18n](https://kazupon.github.io/vue-i18n/) 实现国际化；

  语言文件存放在目录 @/common/lang 下。

  - [x] 语言切换按钮
  - [x] 支持简体中文
  - [x] 支持英语

- **夜间模式**

  使用 vuetify 自带的 dark 主题。

  - [x] 快捷按钮

- **用户使用偏好**

  采用 LocalStorage 存储用户使用偏好。

  - [x] 记忆用户语言使用偏好
  - [x] 记忆用户主题使用偏好

### 后端

- **数据库设计**

  使用 [postgreSQL](https://www.postgresql.org/) 数据库；

  前端用 [axios](http://www.axios-js.com/) 发送请求，后端 `post` 使用 [body-parser](https://github.com/expressjs/body-parser) 接受请求。

  - [x] 用户资料数据库
  - [x] 订单资料数据库
  - [ ] 操作日记数据库

- **数据库维护**
  
  数据库的正常运转需要服务器自动维护更新。

  - [ ] 自动删除过期 token 信息的脚本
  - [ ] 自动备份数据库

- **后端功能**

  - [x] 登录
  - [ ] 注册
  - [x] 修改用户资料
  - [x] 修改密码
  - [ ] 忘记密码

### 核心功能

- **运维部成员操作**

  - [x] 自助添加电话报修信息
  - [x] 确认完成
  - [x] 添加报修服务处理流程

- **报修订单**

  - [x] 选择寝室号
  - [ ] 空闲时间（选择时间段）
  - [x] 描述（可选）
  - [x] 取消订单
  - [x] 预留人性化提醒（重启路由器、确认是否欠费等）
