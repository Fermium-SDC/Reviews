require('dotenv').config();

const { Pool } = require('pg');
// pools will use environment variables
// for connection information
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
// });

module.exports = pool;
