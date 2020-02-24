# 网络在线报修系统

NetUnion - 电子科技大学 | 宿舍网络在线报修平台

## TO DO LIST

基于 [VUE2](https://cn.vuejs.org/) 和 [Express](http://www.expressjs.com.cn/) 开发框架进行设计开发。

### 前端

- **界面设计**

  采用 [Vuetify](https://vuetifyjs.com/zh-Hans/) 组件框架；

  不同的用户应有不同的页面设计和操作按钮，Vue动态加载页面，根据不同用户跳转不同页面。

  - [ ] “登陆”页面
  - [x] 学生“主页”页面
  - [x] 学生“账户”页面
  - [ ] 学生“订单”页面
  - [ ] 学生“关于我们”页面
  - [ ] NetUnion成员“主页”页面
  - [ ] NetUnion成员“账户”页面
  - [ ] NetUnion成员“订单”页面
  - [ ] NetUnion成员“关于我们”页面

- **语言支持**

  采用 [vue-i18n](https://kazupon.github.io/vue-i18n/) 实现国际化；

  语言文件存放在目录 @/common/lang 下。

  - [x] 语言切换按钮
  - [ ] 支持简体中文
  - [ ] 支持英语

- **夜间模式**

  使用 vuetify 自带的 dark 主题。

  - [x] Drawer 界面最下方设置快捷按钮

- **Cookies**

  采用 [vue-cookies](https://github.com/cmp-cc/vue-cookies) 存储 cookies。

  - [x] 记忆用户语言使用偏好
  - [x] 记忆用户主题使用偏好
  - [ ] 记忆用户其它使用偏好

### 后端

- **数据库设计**

  使用 [MySQL 5.7.28](https://downloads.mysql.com/archives/community/) 数据库；

  前端用 [axios](http://www.axios-js.com/) 发送请求，后端使用 [body-parser](https://github.com/expressjs/body-parser) 接受请求。

  - [ ] 用户资料数据库
  - [ ] 订单资料数据库
  - [ ] 操作日记数据库

- **登陆功能**

  用户组分为“学生”、“NetUnion成员”。

  - [ ] 实现登录功能

### 核心功能

- **运维部成员操作**

  - [ ] 自助添加电话报修信息
  - [ ] 确认完成
  - [ ] 添加报修服务处理流程

- **报修订单**

  - [x] 选择寝室号
  - [ ] 空闲时间（选择时间段）
  - [ ] 描述（可选）
  - [ ] 取消订单
  - [x] 预留人性化提醒（重启路由器、确认是否欠费等）
