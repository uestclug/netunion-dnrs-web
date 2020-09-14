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
npm run backend
```

之后您可以：

- 用户组：使用 `2020091202000` 作为账号， `123123` 作为密码登录。
- 处理者组：使用 `2018091202000` 作为账号， `123123` 作为密码登录。

### Run frontend server

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

## TO DO LIST

### 运维部成员操作

- [ ] 可以在订单列表页面添加或修改报修信息、处理情况
- [ ] 添加新的记录状态：无需上门（由师傅处理 | 仅记录）

### 报修订单**

- [ ] 用户可以对尚未结束的订单进行修改
