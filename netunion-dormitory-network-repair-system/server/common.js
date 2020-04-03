/* 存储全局变量 */
const common = {
  status: {
    waiting: 'waiting',
    receipted: 'receipted',
    canceledByUser: 'canceled by user',
    canceledBySolver: 'canceled by solver',
    finished: 'finished'
  },
  password: {
    presentErr: 'present password error'
  },
  group: {
    user: 'user',
    solver: 'solver',
    admin: 'admin'
  }
}

module.exports = common
