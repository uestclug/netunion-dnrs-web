const common = {
  gender: { // 用户性别
    male: '男(Male)',
    female: '女(Female)'
  },
  campus: { // 用户所在校区
    qingshuihe: '清水河校区(Qingshuihe Campus)',
    shahe: '沙河校区(Shahe Campus)'
  },
  status: { // 订单状态
    waiting: 'waiting',
    receipted: 'receipted',
    canceledByUser: 'canceled by user',
    canceledBySolver: 'canceled by solver',
    finished: 'finished',
    recorded: 'recorded'
  },
  password: { // 密码相关
    presentErr: 'present password error'
  },
  role: { // 用户组
    user: 'user',
    solver: 'solver',
    admin: 'admin'
  },
  filter: { // 订单列表过滤
    available: 'available',
    relevant: 'relevant',
    all: 'all'
  }
}

module.exports = common
