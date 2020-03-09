/* 数据库操作函数 */
const orderDatabase = ' public.order '
const solverDatabase = ' public.solver '
const userDatabase = ' public.user '
const tokenDatabase = ' public.token '

const sqlMap = {
  token: {
    // 添加或更新 token 信息
    updateToken: 'INSERT INTO' + tokenDatabase + '(token, expiration_date, id) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET token = $1, expiration_date= $2',
    // 通过 id 获取 token 和 expiration_date
    getTokenResponse: 'SELECT token, expiration_date FROM' + tokenDatabase + 'WHERE id = $1'
  },
  user: {
    // 通过 std_id 获取 password 和 id
    getLoginResponse: 'SELECT password, id FROM' + userDatabase + 'WHERE std_id = $1',
    // 通过 id 获取 password
    getLoginPassword: 'SELECT password FROM' + userDatabase + 'WHERE id = $1',
    // 通过 id 获取用户资料
    queryUserInfo: 'SELECT name, gender, telephone, campus, dormitory, std_id FROM' + userDatabase + 'WHERE id = $1',
    // 修改用户资料
    modifyAccountInfo: 'UPDATE' + userDatabase + 'SET name=$1, gender=$2, campus=$3, dormitory=$4, telephone=$5 WHERE id = $6',
    // 修改用户密码
    modifyPassword: 'UPDATE' + userDatabase + 'SET password=$1 WHERE id = $2'
  },
  solver: {
    // 通过 std_id 获取 password 和 id
    getLoginResponse: 'SELECT password, id FROM' + solverDatabase + 'WHERE std_id = $1',
    // 通过 id 获取 password
    getLoginPassword: 'SELECT password FROM' + solverDatabase + 'WHERE id = $1',
    // 通过 id 获取处理者资料
    querySolverInfo: 'SELECT name, gender, telephone, campus, dormitory, std_id, intro, nickname FROM' + solverDatabase + 'WHERE id = $1',
    // 修改处理者资料
    modifyAccountInfo: 'UPDATE' + solverDatabase + 'SET name=$1, gender=$2, campus=$3, dormitory=$4, telephone=$5, intro=$6, nickname=$7 WHERE id = $8',
    // 修改处理者密码
    modifyPassword: 'UPDATE' + solverDatabase + 'SET password=$1 WHERE id = $2'
  },
  order: {
    // 添加新的订单
    createOrder: 'INSERT INTO' + orderDatabase + '(user_name, user_gender, user_telephone, user_campus, user_dormitory, user_description, order_date, order_status, order_id, solver_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    // 通过 user_id 查询订单信息
    queryOrderInfoFromUserId: 'SELECT user_name, user_gender, user_telephone, user_campus, user_dormitory, user_description, order_date, order_status, solver_id, order_id FROM' + orderDatabase + 'WHERE user_id=$1',
    // 通过 order_id 查询订单信息
    queryOrderInfoFromOrderId: 'SELECT user_name, user_gender, user_telephone, user_campus, user_dormitory, user_description, order_date, order_status, solver_id, user_id FROM' + orderDatabase + 'WHERE order_id=$1',
    // 通过 solver_id 查询订单信息
    queryOrderInfoFromSolverId: 'SELECT user_name, user_gender, user_telephone, user_campus, user_dormitory, user_description, order_date, order_status, order_id, user_id FROM' + orderDatabase + 'WHERE solver_id=$1',
    // 通过 user_gender 和 user_campus 查询订单信息
    queryOrderInfoFromGender: 'SELECT user_name, user_telephone, user_dormitory, user_description, order_date, order_status, solver_id, order_id, user_id FROM' + orderDatabase + 'WHERE user_gender=$1 AND user_campus=$2',
    // 通过 user_id 查询订单状态
    queryOrderStatus: 'SELECT order_status FROM' + orderDatabase + 'WHERE user_id=$1',
    // 通过 order_id 设置订单状态
    setOrderStatus: 'UPDATE' + orderDatabase + 'SET order_status=$1 WHERE order_id=$2',
    // 通过 order_id 接取订单
    setOrderSolver: 'UPDATE' + orderDatabase + 'SET solver_id=$1 WHERE order_id=$2'
  }
}

module.exports = sqlMap
