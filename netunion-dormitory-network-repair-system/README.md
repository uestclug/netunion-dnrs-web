# netunion-dormitory-network-repair-system

![networkOff](./src/assets/networkOff.jpg)

## Project setup

``` node
npm install
```

### Compiles and hot-reloads for development

``` node
npm run serve
```

### 导入 & 设置数据库

`pgsql` 数据库版本为 `11.7` .

在 `pgadmin 4` 中导入 `NetUnion-InternetRepairSys\netunion-dormitory-network-repair-system\server` 目录下的文件 `netunion_dnrs_database.sql` ：

  1. 选择或新建一个数据库

  2. 点击上方的 `工具` ，选择 `还原中`

  3. `文件名` 可复制文件路径或浏览目录，`角色名称` 可选择 `postgres`

修改 `server` 目录下文件 `db.js` 为你的 `pgadmin 4` 设置。

启动后端服务器后，默认可使用 `2018091202000` 作为账号， `123123` 作为密码进行登录。

当然，也可以在 `user` 表中自定义添加登录信息：`std_id` 为登录账号； `password` 填写 `42253fa978ca4bbf95668ec455e4844d` ，对应登录密码为 `123123` ，之后可以在账户页面修改密码。

### 启动后端服务器

在 `NetUnion-InternetRepairSys\netunion-dormitory-network-repair-system\server` 目录下执行：

``` node
node index.js
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
