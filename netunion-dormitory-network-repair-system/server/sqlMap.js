/* 数据库操作函数 */
const sqlMap = {
  user: {
    getPassword: 'SELECT password FROM public."user" WHERE std_id = $1'
  },
  user_netunion: {
    getPassword: 'SELECT password FROM public."user_netunion" WHERE std_id = $1'
  }
};

module.exports = sqlMap
