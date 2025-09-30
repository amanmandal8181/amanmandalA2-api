// event_db.js
// my sql connection pool

const mysql = require("mysql2/promise");  // MySQL client 
require("dotenv").config();               // Load variables from .env

// Create a connection pool, all connections together 
const pool = mysql.createPool({
  host: process.env.DB_HOST,              // localhost
  port: process.env.DB_PORT,              // 3306
  user: process.env.DB_USER,              // root
  password: process.env.DB_PASSWORD,      // aman123
  database: process.env.DB_NAME,          // charityevents_db
  waitForConnections: true,
  connectionLimit: 10
});


// Helper to run SQL with placeholders (prevents SQL injection)
async function run(sql, params = []) {
  const [rows] = await pool.execute(sql, params); // Executes safely with ?
  return rows;                                    // Returns result rows
}

module.exports = { run };
