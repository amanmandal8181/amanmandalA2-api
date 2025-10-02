// routes/events.js
// defines API endpoints related to categories and events

const express = require("express");
const router = express.Router();
const { run } = require("../event_db"); // run() is our helper to query the DB

// GET /api/categories
// Returns list of all categories
router.get("/categories", async (_req, res) => {
  try {
    const rows = await run(
      "SELECT category_id, name FROM categories ORDER BY name"
    );
    res.json(rows); // send back array of categories
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load categories" });
  }
});

// GET /api/events
// Returns list of events with optional filters
router.get("/events", async (req, res) => {
  try {
    // Read query params from the request URL
    const { dateFrom, dateTo, city, categoryId, activeOnly = "true" } = req.query;

    // Base SQL query
    let sql = `
      SELECT e.event_id, e.name, e.event_datetime, e.city, e.venue,
             e.price, e.is_free, e.status,
             e.goal_amount, e.progress_amount,
             c.name AS category_name
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      WHERE 1=1
    `;
    const params = [];

    // Add filters only if they exist
    if (activeOnly === "true") sql += " AND e.status='active'";
    if (dateFrom) {
      sql += " AND e.event_datetime >= ?";
      params.push(`${dateFrom} 00:00:00`);
    }
    if (dateTo) {
      sql += " AND e.event_datetime <= ?";
      params.push(`${dateTo} 23:59:59`);
    }
    if (city) {
      sql += " AND e.city LIKE ?";
      params.push(`%${city}%`);
    }
    if (categoryId) {
      sql += " AND e.category_id = ?";
      params.push(Number(categoryId));
    }

    sql += " ORDER BY e.event_datetime ASC";

    const rows = await run(sql, params);
    res.json(rows); // send back array of events
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load events" });
  }
});

// GET /api/events/:id
// Returns full details of one event
router.get("/events/:id", async (req, res) => {
  try {
    const sql = `
      SELECT e.*, 
             c.name AS category_name,
             o.name AS org_name, o.mission, o.contact_email, o.contact_phone
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      JOIN organisations o ON e.org_id = o.org_id
      WHERE e.event_id = ?
    `;
    const rows = await run(sql, [Number(req.params.id)]);
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });

    res.json(rows[0]); // return single event object
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load event" });
  }
});

module.exports = router;
