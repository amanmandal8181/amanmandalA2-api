// server.js
// Import required libraries
const express = require("express");   // Web framework
const cors = require("cors");         // frontend to call this API
require("dotenv").config();           // Load .env file (later)


//import run from event_db.js
const { run } = require("./event_db");



// Create an express app
const app = express();
app.use(cors());

//  check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });         // in browser seen 
});




//  to test database connectivity
app.get("/db-ping", async (req, res) => {
  try {
    const rows = await run("SELECT 1 AS ok");  // Simple test query
    res.json(rows[0]);                         // Expect: {"ok":1}
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
});




// Start server on port 4000
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});




