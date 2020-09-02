/* 数据库 model */
module.exports = {
  pgsql: {
    host: '47.98.154.166',
    port: 5432,
    user: 'netunion_dnrs_visitor',
    password: 'root',
    database: 'netunion_dnrs',
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
}
