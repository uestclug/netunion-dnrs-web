# 网络在线报修系统

NetUnion - 电子科技大学 | 宿舍网络在线报修平台

## TO DO LIST

基于 [VUE2](https://cn.vuejs.org/) 进行设计开发

- [ ] 界面设计
  - 采用 [vuetify.css](https://vuetifyjs.com/zh-Hans/) 组件框架
- [ ] 登陆功能
  - 用户组分为“学生”、“运维部”和“管理员”
- [ ] 双语支持
  - 采用 [vue-i18n](https://kazupon.github.io/vue-i18n/) 实现国际化
  - 语言文件存放在目录 @/common/lang 下
- [ ] 运维部成员操作
  - 自助添加电话报修信息
  - 确认完成
  - 添加报修服务处理流程
- [ ] 报修订单
  - 选择寝室号
  - 空闲时间（选择时间段）
  - 描述（可选）
  - 取消订单等
- [ ] 预留人性化提醒（重启路由器、确认是否欠费等）
- [ ] 夜间模式
  - 使用 vuetify 自带的 dark 主题
  - Drawer 界面最下方设置快捷按钮
- [ ] Cookies
  - 采用 [vue-cookies](https://github.com/cmp-cc/vue-cookies) 存储 cookies
  - 记忆用户语言使用偏好
  - 记忆用户主题使用偏好
