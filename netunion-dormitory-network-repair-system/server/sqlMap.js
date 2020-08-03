/* 数据库操作函数 */
const orderDatabase = ' public.order '
const userDatabase = ' public.account_user '
const solverDatabase = ' public.account_solver '
const loginDetailsDatabase = ' public.account_login_details '
const tokenDatabase = ' public.token '

const sqlMap = {
  token: {
    // 添加或更新 token 信息
    updateToken: 'INSERT INTO' + tokenDatabase + '(token, expiration_date, id) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET token = $1, expiration_date= $2',
    // 通过 id 获取 token 信息
    getTokenResponse: 'SELECT * FROM' + tokenDatabase + 'WHERE id = $1'
  },
  user: {
    // 通过 std_id 获取 password 和 id
    getLoginResponse: 'SELECT * FROM' + loginDetailsDatabase + 'WHERE std_id = $1',
    // 通过 id 获取 password
    getLoginPassword: 'SELECT password FROM' + loginDetailsDatabase + 'WHERE id = $1',
    // 通过 id 获取用户资料
    queryUserInfo: 'SELECT * FROM' + userDatabase + 'WHERE id = $1',
    // 修改用户资料
    modifyAccountInfo: 'UPDATE' + userDatabase + 'SET name=$1, gender=$2, campus=$3, dormitory=$4, telephone=$5 WHERE id = $6',
    // 修改用户密码
    modifyPassword: 'UPDATE' + userDatabase + 'SET password=$1 WHERE id = $2'
  },
  order: {
    // 添加新的订单
    createOrder: 'INSERT INTO' + orderDatabase + '(order_user_name, order_user_gender, order_user_telephone, order_user_campus, order_user_dormitory, order_user_description, order_date, order_status, order_id, order_solver_id, order_user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    // 通过 order_user_id 查询订单信息
    queryOrderInfoByUserId: 'SELECT * FROM' + orderDatabase + 'WHERE order_user_id=$1',
    // 通过 order_id 查询订单信息
    queryOrderInfoByOrderId: 'SELECT * FROM' + orderDatabase + 'WHERE order_id=$1',
    // 通过 order_solver_id 查询订单信息
    queryOrderInfoBySolverId: 'SELECT * FROM' + orderDatabase + 'WHERE order_solver_id=$1',
    // 通过 order_user_id 和 order_status 查询订单信息
    getSelectedOrder: 'SELECT * FROM' + orderDatabase + 'WHERE(order_user_id = $1 and order_status = $2)',
    // 通过 order_user_gender 和 user_campus 查询订单信息
    queryOrderInfoByGender: 'SELECT * FROM' + orderDatabase + 'WHERE order_user_gender=$1 AND order_user_campus=$2',
    // 通过 order_id 设置订单状态
    setOrderStatus: 'UPDATE' + orderDatabase + 'SET order_status=$1 WHERE order_id=$2',
    // 通过 order_id 接取订单
    setOrderSolver: 'UPDATE' + orderDatabase + 'SET order_solver_id=$1 WHERE order_id=$2',
    // 通过 order_solver_id 查询 solver 信息
    querySolverInfo: 'SELECT name, telephone, intro, nickname FROM' + userDatabase + 'WHERE id = $1'
  }
}

module.exports = sqlMap
