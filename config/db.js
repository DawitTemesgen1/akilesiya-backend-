const mysql = require('mysql2/promise');
try { require('dotenv').config(); } catch (e) { console.log('Items: dotenv not found, assuming env vars are set.'); }

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('✅ MySQL Connection Pool Created Successfully.');

module.exports = pool;