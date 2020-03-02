/* 数据库操作函数 */
const tokenDatabase = ' public.user_token '
const userDatabase = ' public.\"user\" '
const userNetunionDatabase = ' public.user_netunion '

const sqlMap = {
  token: {
    // 添加或更新 token 信息
    updateToken: 'INSERT INTO' + tokenDatabase + '(token, expiration_date, id) VALUES ($1, $2, $3) ON conflict (id) DO UPDATE SET token = $1, expiration_date= $2',
    // 通过 id 获取 token 和 expiration_date
    getTokenResponse: 'SELECT token, expiration_date FROM' + tokenDatabase + 'WHERE id = $1'
  },
  user: {
    // 通过 std_id 获取 password 和 id
    getLoginResponse: 'SELECT password, id FROM' + userDatabase + 'WHERE std_id = $1',
    // 通过 id 获取 password
    getLoginPassword: 'SELECT password FROM' + userDatabase + 'WHERE id = $1',
    // 通过 id 获取用户资料
    queryUserInfo: 'SELECT name, telephone, campus, dormitory, std_id FROM' + userDatabase + 'WHERE id = $1',
    // 修改用户资料
    modifyAccountInfo: 'UPDATE' + userDatabase + 'SET name=$1, campus=$2, dormitory=$3, telephone=$4 WHERE id = $5',
    // 修改用户密码
    modifyPassword: 'UPDATE' + userDatabase + 'SET password=$1 WHERE id = $2'
  },
  user_netunion: {
    // 通过 std_id 获取 password 和 id
    getLoginResponse: 'SELECT password, id FROM' + userNetunionDatabase + 'WHERE std_id = $1'
  }
}

module.exports = sqlMap
