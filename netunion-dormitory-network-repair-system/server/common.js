/* 存储前后端通用的全局变量 */
const common = {
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
