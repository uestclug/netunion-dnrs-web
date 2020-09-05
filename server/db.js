/* 数据库 model */
module.exports = {
  pgsql: {
    host: process.env.POSTGRS_HOST || 'localhost',
    port: process.env.POSTGRS_PORT || 5432,
    user: process.env.POSTGRES_USER || 'netunion_dnrs_visitor',
    password: process.env.POSTGRES_PASSWORD || 'root',
    database: process.env.POSTGRES_DB || 'netunion_dnrs',
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
}
