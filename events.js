// routes/events.js

const express = require("express");
const router = express.Router();
const { run } = require("../event_db");

// GET /api/categories → list all categories
router.get("/categories", async (_req, res) => {
  try {
    const rows = await run("SELECT category_id, name FROM categories ORDER BY name");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load categories" });
  }
});

module.exports = router;
