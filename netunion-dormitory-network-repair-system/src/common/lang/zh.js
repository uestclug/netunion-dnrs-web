module.exports = {
  app: {
    name: 'UESTC | 学生宿舍网络报修平台'
  },
  viewTitle: {
    home: '主页',
    user: '账户',
    order: '订单',
    about: '关于我们',
    login: '登录'
  },
  theme: {
    darkMode: '夜间模式'
  },
  home: {
    welcome: {
      words: '别担心，',
      slogan: '宿舍网络问题找我们！'
    },
    latestOrder: {
      title: '最近的订单',
      freeTime: '空闲时间',
      location: '寝室号',
      solver: '处理人',
      viewDetails: '进入订单',
      status: '订单状态'
    },
    infoNote: {
      note: '我们建议您首先检查网络是否欠费并试着重启路由器'
    }
  },
  user: {
    account: {
      title: '账户资料',
      setting: '修改信息',
      name: '姓名',
      campus: '所在校区',
      location: '寝室号',
      telephone: '联系电话'
    },
    statistics: {
      title: '统计信息',
      orderTime: '订单次数',
      firstOrderDate: '第一次下单日期',
      firstOrderSolver: '第一次的处理者',
      lastOrderDate: '最近一次下单日期',
      lastOrderSolver: '最近一次处理者',
      unlockedSolver: '解锁的处理者数',
      bestSolver: '你最好的SOLVER',
      bestSolverOrderedTime: '以及Ta帮助你的次数'
    }
  },
  order: {
    createOrder: {
      create: '新建网络报修订单',
      cancelTip: '已填写内容不会消失',
      submit: '提交',
      cancel: '取消',
      nameLabel: '姓名',
      telephoneLabel: '联系电话',
      campusLabel: '所处校区',
      dormitoryLabel: '寝室地址',
      descriptionLabel: '描述（可选）',
      nameMaxLengthErr: '姓名最长输入 20 字符',
      nameRequiredErr: '嗨，请告诉我们您的姓名',
      telephoneMaxLengthErr: '电话最长输入 11 字符',
      telephoneRequiredErr: '联系电话是我们沟通的桥梁',
      campusRequiredErr: '两个校区的 SOLVER 同样尽心尽责',
      dormitoryRequiredErr: '填写您的宿舍楼栋与寝室号，我们整装待发',
      descriptionHint: '添加对具体情况的描述可以帮助我们更好地解决问题'
    }
  },
  login: {
    submit: '登陆',
    usernameLabel: '学号',
    pwdLabel: '密码',
    usernameRequiredErr: '您需要输入您的学号作为用户名',
    pwdRequiredErr: '您需要输入正确的密码进行登陆',
    loginFailed: '学号或密码错误，请检查！',
    loginSucceed: '欢迎你，',
    tokenCheckFailed: '账户凭证过期或错误，请重新登陆！'
  }
}
