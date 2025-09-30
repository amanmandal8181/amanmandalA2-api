// server.js
// Import required libraries
const express = require("express");   // Web framework
const cors = require("cors");         // frontend to call this API
require("dotenv").config();           // Load .env file (later)

// Create an express app
const app = express();
app.use(cors());

//  check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });         // in browser seen 
});

// Start server on port 4000
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
