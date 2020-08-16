/* 存储前后端通用的全局变量 */
const common = {
  status: {
    waiting: 'waiting',
    receipted: 'receipted',
    canceledByUser: 'canceled by user',
    canceledBySolver: 'canceled by solver',
    finished: 'finished',
    recorded: 'recorded'
  },
  password: {
    presentErr: 'present password error'
  },
  role: {
    user: 'user',
    solver: 'solver',
    admin: 'admin'
  }
}

module.exports = common
