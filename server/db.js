const pg = require('pg')

const config = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || 'netunion_dnrs_visitor',
  password: process.env.POSTGRES_PASSWORD || 'root',
  database: process.env.POSTGRES_DB || 'netunion_dnrs',
  max: 20,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 2000
}

const pool = new pg.Pool(config)

module.exports = pool
