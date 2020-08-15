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
    infoNote: {
      note: '我们建议您首先检查网络是否欠费并试着重启路由器'
    }
  },
  user: {
    account: {
      title: '账户资料',
      modify: '修改信息',
      modifyPassword: '修改密码',
      logout: '登出',
      logoutText: '确定要退出吗？',
      name: '姓名',
      nickname: '昵称',
      gender: '性别',
      campus: '所在校区',
      location: '寝室地址',
      telephone: '联系电话',
      intro: '个人简介',
      nameMaxLengthErr: '姓名最长 20 字符',
      nicknameMaxLengthErr: '昵称最长 30 字符',
      introMaxLengthErr: '个人简介最长 50 字符',
      modifyAccountInfoNote: '再次点击按钮可保存修改信息。',
      modifyAccountInfoSucceed: '已保存修改信息！',
      modifyAccountInfoFailed: '修改资料失败，请检查网络或稍后尝试。',
      presentPassword: '当前密码',
      modifiedPassword: '新密码',
      reModifiedPassword: '确认新密码',
      passwordMaxLengthErr: '密码最长 32 位',
      passwordminLengthErr: '密码最短 6 位',
      presentPasswordRequiredErr: '您需要输入当前的密码',
      modifiedPasswordRequiredErr: '您需要输入新的密码',
      reModifiedPasswordRequiredErr: '您需要再次输入新密码',
      reModifiedPasswordErr: '两次输入的新密码不相同，请重新输入',
      modifyPasswordSucceed: '修改密码成功！',
      presentPasswordErr: '当前密码错误，请重新输入',
      unknownErr: '发生不明错误，密码修改失败',
      cancel: '取消',
      submit: '提交',
      confirm: '确认'
    },
    statistics: {
      title: '统计信息',
      finishedOrderTime: '完成订单次数',
      firstOrderDate: '第一次完成订单日期',
      firstOrderSolver: '第一次的处理者',
      lastOrderDate: '最近一次完成订单日期',
      lastOrderSolver: '最近一次处理者',
      unlockedSolver: '解锁的处理者数',
      bestSolver: '你最好的 SOLVER',
      bestSolverOrderedTime: '以及 Ta 帮助你的次数',
      finishedOrderTimeTotally: '完成订单总数',
      finishedOrderTimeMonthly: '本月完成订单数',
      firstOrderUser: '第一次的用户名',
      lastOrderUser: '最近一次用户名',
      unlockedUser: '遇见的用户数（不重复）',
      bestUser: '最佳用户',
      bestUserOrderedTime: '以及你帮助 Ta 的次数'
    }
  },
  order: {
    waitingStatus: '等待接单',
    receiptedStatus: '已接单',
    canceledByUserStatus: '订单取消',
    canceledBySolverStatus: '订单被取消',
    finishedStatus: '订单完成',
    unknownStatus: '订单穿越了银河系',
    cancelSucceed: '订单取消成功',
    createOrder: {
      create: '新建网络报修订单',
      cancelTip: '已填写内容不会消失',
      submit: '提交',
      cancel: '取消',
      nameLabel: '姓名',
      genderLabel: '性别',
      telephoneLabel: '联系电话',
      campusLabel: '所处校区',
      dormitoryLabel: '寝室地址',
      descriptionLabel: '描述（可选）',
      nameMaxLengthErr: '姓名最长输入 20 字符',
      nameRequiredErr: '嗨，请告诉我们您的姓名',
      telephoneMaxLengthErr: '电话最长输入 11 字符',
      telephoneRequiredErr: '联系电话是我们沟通的桥梁',
      genderRequiredErr: '我们会为您指配正确的 SOLVER',
      campusRequiredErr: '两个校区的 SOLVER 同样尽心尽责',
      dormitoryRequiredErr: '填写您的宿舍楼栋与寝室号，我们整装待发',
      descriptionHint: '添加您的空闲时间或对具体情况的描述可以帮助我们更好地解决问题',
      autoEnter: '自动填写',
      autoEnterNote: '将根据您的个人资料自动填写表单',
      orderStatusErr: '您有正在进行中的订单，无法创建新的订单',
      orderStatusCheckErr: '订单信息获取失败',
      createFailed: '订单创建失败，请来电抱怨！',
      createSucceed: '订单创建成功，我们会尽快为您处理！'
    },
    latestOrder: {
      title: '最近的订单',
      freeTime: '空闲时间',
      location: '寝室地址',
      solver: '处理人',
      solverTelephone: '工作电话',
      viewDetails: '进入订单',
      status: '订单状态',
      cancelOrder: '取消订单',
      cancel: '取消',
      confirm: '确认',
      cancelOrderNote: '已被接受的订单请联系处理人取消',
      cancelOrderText: '尚无人接单，您确定要取消当前订单吗？',
      cancelOrderSucceed: '您成功取消了当前订单',
      cancelOrderFailed: '似乎发生了什么问题，您未能取消当前订单',
      orderInfo: '订单信息',
      name: '姓名',
      campus: '所处校区',
      description: '订单描述',
      telephone: '联系电话',
      date: '订单日期'
    }
  },
  login: {
    submit: '登录',
    usernameLabel: '学号',
    pwdLabel: '密码',
    usernameRequiredErr: '您需要输入您的学号作为用户名',
    pwdRequiredErr: '您需要输入正确的密码进行登录',
    loginFailed: '学号或密码错误，请检查！',
    loginSucceed: '欢迎你，',
    logoutSuccess: '您已成功登出。',
    infoCheckFailed: '用户信息检查失败，请重新登陆！',
    unknownFailed: '时代变了！请重新登陆。',
    tokenCheckFailed: '账户凭证过期或错误，请重新登录！'
  }
}
