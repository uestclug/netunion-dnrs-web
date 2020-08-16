/* 数据库操作函数 */
const accountTable = ' public.account '
const orderTable = ' public.order '
const tokenTable = ' public.token '

const sqlMap = {
  token: {
    // 设置用户 token 信息
    setToken: 'INSERT INTO' + tokenTable + '(token, expiration_date, user_id) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET token = $1, expiration_date= $2',
    // 通过 user_id 获取 token 信息
    getTokenAndRole: 'SELECT t.token, t.expiration_date, a.role FROM' + tokenTable + 'AS t LEFT JOIN' + accountTable + 'AS a ON t.user_id = a.user_id WHERE t.user_id = $1'
  },
  account: {
    // 通过 std_id 获取 password 和 user_id
    getLoginResponse: 'SELECT password, user_id, role FROM' + accountTable + 'WHERE std_id = $1',
    // 通过 user_id 获取 password
    getLoginPassword: 'SELECT password FROM' + accountTable + 'WHERE user_id = $1',
    // 通过 user_id 获取用户资料
    queryUserInfo: 'SELECT name, nickname, gender, telephone, campus, dormitory, intro FROM' + accountTable + 'WHERE user_id = $1',
    // 修改用户密码
    modifyPassword: 'UPDATE' + accountTable + 'SET password=$1 WHERE user_id = $2',
    // 修改用户资料
    modifyAccountInfo: 'UPDATE' + accountTable + 'SET name=$1, nickname=$2, gender=$3, campus=$4, dormitory=$5, telephone=$6, intro=$7 WHERE user_id = $8',
    user: { // 对于 user 用户组

    },
    solver: { // 对于 solver 用户组

    },
    admin: { // 对于 admin 用户组

    }
  },
  order: {
    user: { // 对于 user 用户组
      // 添加新的订单
      createOrder: 'INSERT INTO' + orderTable + '(order_user_name, order_user_gender, order_user_telephone, order_user_campus, order_user_dormitory, order_user_description, create_date, order_status, order_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      // 通过 user_id 查询所有该用户创建的订单信息
      queryOrderInfoByUserId: 'SELECT * FROM' + orderTable + 'WHERE user_id = $1'
    },
    solver: { // 对于 solver 用户组
      createOrder: 'INSERT INTO' + orderTable + '(order_user_name, order_user_gender, order_user_telephone, order_user_campus, order_user_dormitory, order_user_description, order_solver_record, order_status, order_id, solver_id, create_date, close_date, order_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
      // 通过 order_id 接取订单
      setOrderSolver: 'UPDATE' + orderTable + 'SET solver_id = $1 WHERE order_id = $2',
      // 通过 order_user_gender 和 user_campus 查询订单信息
      queryOrderInfoByGenderAndCampus: 'SELECT * FROM' + orderTable + 'WHERE order_user_gender = $1 AND order_user_campus = $2',
      // 通过 solver_id 查询所有订单信息
      queryOrderInfoBySolverId: 'SELECT * FROM' + orderTable + 'WHERE solver_id = $1'
    },
    admin: { // 对于 admin 用户组

    },
    // 通过 order_id 查询所有订单信息
    queryOrderInfoByOrderId: 'SELECT * FROM' + orderTable + 'WHERE order_id = $1',
    // 通过 user_id 和 order_status 查询订单信息
    getSelectedOrder: 'SELECT * FROM' + orderTable + 'WHERE (user_id = $1 AND order_status = $2)',
    // 通过 order_id 设置订单状态
    setOrderStatus: 'UPDATE' + orderTable + 'SET order_status = $1 WHERE order_id = $2',
    // 通过 solver_id 查询 solver 信息
    querySolverInfo: 'SELECT a.name, a.telephone, a.intro, a.nickname FROM' + accountTable + 'AS a,' + orderTable + 'AS o WHERE a.user_id = o.solver_id AND o.solver_id = $1'
  }
}

module.exports = sqlMap
