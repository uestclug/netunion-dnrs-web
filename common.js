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
  },
  actionNotes: { // 订单操作记录
    userCreateOrder: '用户创建了订单',
    userModifyOrder: '用户修改了订单信息',
    userCloseOrder: '用户关闭了订单',
    solverCreateOrder: '创建了订单',
    solverCreateAndAcceptOrder: '创建并接取了订单',
    solverRecordOrder: '添加了订单记录',
    solverModifyOrder: '修改了订单信息',
    solverAcceptOrder: '接取了订单',
    solverFinishOrder: '设置订单已完成',
    solverRestoreOrder: '重置订单为可接取状态',
    solverCancelOrder: '取消了订单，订单回到可接取状态',
    solverCloseOrder: '关闭了订单',
    solverAddAttn: '添加了出勤记录',
    solverAddAsgn: '添加了协作人',
    solverRemoveAsgn: '移除了协作人'
  }
}

module.exports = common
