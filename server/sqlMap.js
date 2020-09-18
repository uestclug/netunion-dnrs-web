/* 数据库操作函数 */
const accountTable = ' public.account '
const orderTable = ' public.order '
const orderActionNotesTable = ' public.order_action_notes '
const orderAssigneeTable = ' public.order_assignee '
const orderAttendanceTable = ' public.order_attendance '
const storageTable = ' public.storage '
const tokenTable = ' public.token '

const sqlMap = {
  token: {
    // 设置用户 token 信息
    setToken: '\
      INSERT INTO' + tokenTable + '\
      (token, expiration_date, user_id) \
      VALUES ($1, $2, $3) \
      ON CONFLICT (user_id) \
      DO UPDATE SET token = $1, expiration_date= $2',
    // 通过 user_id 获取 token 信息
    getTokenAndRole: '\
      SELECT t.token, t.expiration_date, a.role \
      FROM' + tokenTable + 'AS t \
      LEFT JOIN' + accountTable + 'AS a \
      ON t.user_id = a.user_id \
      WHERE t.user_id = $1'
  },
  account: {
    // 通过 std_id 获取 password 和 user_id
    getLoginResponse: '\
      SELECT password, user_id, role \
      FROM' + accountTable + '\
      WHERE std_id = $1',
    // 通过 std_id 获取处理者的资料
    getSolverInfoByStdId: '\
      SELECT * \
      FROM' + accountTable + '\
      WHERE std_id = $1',
    // 通过 user_id 获取 password
    getLoginPassword: '\
      SELECT password \
      FROM' + accountTable + '\
      WHERE user_id = $1',
    // 通过 user_id 获取用户资料
    queryUserInfo: '\
      SELECT name, nickname, gender, telephone, campus, dormitory, intro \
      FROM' + accountTable + '\
      WHERE user_id = $1',
    // 修改用户密码
    modifyPassword: '\
      UPDATE' + accountTable + '\
      SET password=$1 \
      WHERE user_id = $2',
    // 修改用户资料
    modifyAccountInfo: '\
      UPDATE' + accountTable + '\
      SET name=$1, nickname=$2, gender=$3, campus=$4, dormitory=$5, telephone=$6, intro=$7 \
      WHERE user_id = $8'
  },
  order: {
    user: { // 对于 user 用户组
      // 添加新的订单
      createOrder: '\
        INSERT INTO' + orderTable + '\
        (order_user_name, order_user_gender, order_user_telephone, order_user_campus, \
        order_user_dormitory, order_user_description, create_date, order_status, order_id, user_id) \
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      // 通过 user_id 查询所有该用户创建的订单信息
      queryOrderInfoByUserId: '\
        SELECT * \
        FROM' + orderTable + '\
        WHERE user_id = $1',
      // 将等待中的订单关闭
      closeOrder: '\
        UPDATE' + orderTable + '\
        SET solver_id = null, order_status = \'canceled by user\', close_date = $1 \
        WHERE order_id = $2'
    },
    solver: { // 对于 solver 用户组
      // 处理者创建新的订单
      createOrder: '\
        INSERT INTO' + orderTable + '\
        (order_user_name, order_user_gender, order_user_telephone, order_user_campus, order_user_dormitory, \
        order_user_description, order_solver_record, order_status, order_id, solver_id, create_date, close_date) \
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
      // 通过 order_user_gender 和 user_campus 查询订单信息
      queryOrderInfoByGenderAndCampus: '\
        SELECT * \
        FROM' + orderTable + '\
        WHERE order_user_gender = $1 AND order_user_campus = $2',
      // 通过 solver_id 查询所有订单信息
      queryOrderInfoBySolverId: '\
        SELECT * \
        FROM' + orderTable + '\
        WHERE solver_id = $1',
      // 通过 solver_id 查询进行中的订单信息
      queryAcceptedOrder: '\
        SELECT * \
        FROM' + orderTable + '\
        WHERE order_status = \'receipted\' AND solver_id = $1 \
        ORDER BY create_date',
      // 获取 orderList 中的数据（显示全部）
      queryOrderListAll: '\
        SELECT o.*, a.name AS solver_name, a.nickname AS solver_nickname, a.std_id AS solver_std_id \
        FROM' + orderTable + 'AS o \
        LEFT JOIN' + accountTable + 'AS a \
        ON a.user_id = o.solver_id \
        ORDER BY o.create_date',
      // 通过 order_id 接取订单
      receiptOrder: '\
        UPDATE' + orderTable + '\
        SET solver_id = $1, order_status = \'receipted\' \
        WHERE order_id = $2',
      // 通过 order_id 设置订单完成
      finishOrder: '\
        UPDATE' + orderTable + '\
        SET order_status = \'finished\', close_date = $1 \
        WHERE order_id = $2',
      // 将处理者关闭的订单重置
      restoreOrder: '\
        UPDATE' + orderTable + '\
        SET solver_id = null, order_status = \'waiting\', close_date = null \
        WHERE order_id = $1',
      // 将处理者接取的订单取消，回到等待接单状态
      cancelOrder: '\
        UPDATE' + orderTable + '\
        SET solver_id = null, order_status = \'waiting\' \
        WHERE order_id = $1',
      // 将等待中的订单或处理者接取的订单关闭
      closeOrder: '\
        UPDATE' + orderTable + '\
        SET solver_id = null, order_status = \'canceled by solver\', close_date = $1 \
        WHERE order_id = $2'
    },
    admin: { // 对于 admin 用户组

    },
    assignee: { // 订单的协作人
      // 通过 order_id 和 user_id 删除此订单的 assignee 信息
      removeAssignee: '\
        DELETE FROM' + orderAssigneeTable + '\
        WHERE order_id = $1 AND assignee_id = $2',
      // 通过 order_id 和 user_id 添加此订单的 assignee 信息
      addAssignee: '\
        INSERT INTO' + orderAssigneeTable + '(order_id, assignee_id) \
        VALUES ($1, $2)',
      // 通过 order_id 查询此订单的 assignee 信息
      queryAssigneeInfo: '\
        SELECT oasgn.assignee_id AS solver_id, a.std_id AS solver_std_id, a.name AS solver_name \
        FROM' + orderAssigneeTable + 'AS oasgn \
        LEFT JOIN' + accountTable + 'AS a \
        ON a.user_id = oasgn.assignee_id \
        WHERE oasgn.order_id = $1',
      // 当取消或关闭订单时，通过 order_id 删除此订单所有的 assignee 信息
      removeAllAssignee: '\
        DELETE FROM' + orderAssigneeTable + '\
        WHERE order_id = $1'
    },
    attendance: { // 订单的出勤记录
      // 通过 order_id 查询此订单的 attendance 信息
      queryAttendanceInfo: '\
        SELECT oattn.*, a.name AS solver_name \
        FROM' + orderAttendanceTable + 'AS oattn \
        LEFT JOIN' + accountTable + 'AS a \
        ON a.user_id = oattn.solver_id \
        WHERE oattn.order_id = $1 \
        ORDER BY oattn.attn_date DESC',
      // 添加新的 attendance 信息
      addAttendance: '\
        INSERT INTO' + orderAttendanceTable + '(order_id, solver_id, attn_description, attn_date) \
        VALUES ($1, $2, $3, $4)'
    },
    actionNotes: { // 订单的操作记录
      // 添加订单的操作记录
      addActionNotes: '\
        INSERT INTO' + orderActionNotesTable + '(order_id, user_id, notes_text, action_date) \
        VALUES ($1, $2, $3, $4)',
      // 通过 order_id 查询所有用户对此订单的操作记录
      queryActionNotesByOrderId: '\
        SELECT oan.*, a.name AS user_name \
        FROM' + orderActionNotesTable + 'AS oan \
        LEFT JOIN' + accountTable + 'AS a \
        ON oan.user_id = a.user_id \
        WHERE oan.order_id = $1 \
        ORDER BY oan.action_date DESC',
      // 通过 user_id 查询指定用户对所有订单的操作记录信息
      queryActionNotesByUserId: '\
        SELECT oan.*, a.name AS user_name \
        FROM' + orderActionNotesTable + 'AS oan \
        LEFT JOIN' + accountTable + 'AS a \
        ON oan.user_id = a.user_id \
        WHERE oan.user_id = $1 \
        ORDER BY oan.action_date DESC',
      // 通过 order_id 和 user_id 查询指定用户对此订单的操作记录
      queryActionNotesByOrderIdAndUserId: '\
        SELECT oan.*, a.name AS user_name \
        FROM' + orderActionNotesTable + 'AS oan \
        LEFT JOIN' + accountTable + 'AS a \
        ON oan.user_id = a.user_id \
        WHERE oan.order_id = $1 AND oan.user_id = $2 \
        ORDER BY oan.action_date DESC'
    },
    // 通过 order_id 查询订单信息
    queryOrderInfoByOrderId: '\
      SELECT * \
      FROM' + orderTable + '\
      WHERE order_id = $1',
    // 通过 user_id 和 order_status 查询订单信息
    getSelectedOrder: '\
      SELECT * \
      FROM' + orderTable + '\
      WHERE (user_id = $1 AND order_status = $2)',
    // 通过 order_id 设置订单状态
    setOrderStatus: '\
      UPDATE' + orderTable + '\
      SET order_status = $1 \
      WHERE order_id = $2',
    // 通过 user_id 查询 solver 信息
    querySolverInfo: '\
      SELECT name, telephone, intro, nickname \
      FROM' + accountTable + '\
      WHERE user_id = $1',
    // 获取 order 总数
    countOrderLength: '\
      SELECT count(*) \
      FROM' + orderTable,
    // 获取 orderList 中的数据（显示可用）
    queryOrderListAvailable: '\
      SELECT o.*, a.name AS solver_name, a.nickname AS solver_nickname, a.std_id AS solver_std_id \
      FROM' + orderTable + 'AS o \
      LEFT JOIN' + accountTable + 'AS a \
      ON a.user_id = o.solver_id \
      WHERE o.order_status = \'waiting\' OR (o.order_status = \'receipted\' AND o.solver_id = $1) \
      ORDER BY o.create_date DESC LIMIT $2 OFFSET $3',
    // 获取 orderList 中的数据（显示相关）
    queryOrderListRelevant: '\
      SELECT o.*, a.name AS solver_name, a.nickname AS solver_nickname, a.std_id AS solver_std_id \
      FROM' + orderTable + 'AS o \
      LEFT JOIN' + accountTable + 'AS a \
      ON a.user_id = o.solver_id \
      WHERE o.order_status = \'waiting\' OR o.solver_id = $1 \
      ORDER BY o.create_date DESC LIMIT $2 OFFSET $3',
    // 获取 orderList 中的数据（显示全部）
    queryOrderListAll: '\
      SELECT o.*, a.name AS solver_name, a.nickname AS solver_nickname, a.std_id AS solver_std_id \
      FROM' + orderTable + 'AS o \
      LEFT JOIN' + accountTable + 'AS a \
      ON a.user_id = o.solver_id \
      ORDER BY o.create_date DESC LIMIT $1 OFFSET $2'
  },
  about: {
    // 获取近一个月创建的有效订单
    queryCreateOrderInfo: '\
      SELECT order_id, order_status, create_date \
      FROM' + orderTable + '\
      WHERE create_date > $1 AND order_status <> \'canceled by solver\' AND order_status <> \'canceled by user\' \
      ORDER BY create_date',
    // 从 storage 中获取近一个月创建订单数
    queryCreateOrderMonthly: '',
    // 向 storage 中更新近一个月创建订单数
    updateCreateOrderMonthly: '',
    // 获取近一个月完成的有效订单
    queryFinishedOrderInfo: '\
      SELECT order_id, order_status, create_date \
      FROM' + orderTable + '\
      WHERE create_date > $1 AND (order_status = \'finished\' OR order_status = \'recorded\') \
      ORDER BY create_date',
    // 从 storage 中获取近一个月完成订单数
    queryFinishedOrderMonthly: '',
    // 向 storage 中更新近一个月完成订单数
    updateFinishedOrderMonthly: '',
    // 获取处理者近一个月完成的有效订单数（从完成数多到少排序）
    queryMostValuableSolverInfo: '\
      SELECT count(o.*) AS finish_order_count, a.user_id , a.name, a.nickname, a.intro \
      FROM' + orderTable + 'AS o \
      LEFT JOIN' + accountTable + 'AS a \
      ON o.solver_id = a.user_id \
      WHERE o.close_date > $1 AND (o.order_status = \'finished\' OR o.order_status = \'recorded\') \
      GROUP BY a.user_id, a.name, a.nickname, a.intro \
      ORDER BY finish_order_count DESC',
    // 从 storage 中获取近一个月的最佳处理者
    queryMostValuableSolverMonthly: '',
    // 向 storage 中更新近一个月的最佳处理者
    updateMostValuableSolverMonthly: ''
  }
}

module.exports = sqlMap
