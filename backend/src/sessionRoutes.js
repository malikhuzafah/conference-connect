const express = require("express");
const router = express.Router();
const sessions = require("./sessions");
const { isAuthenticated } = require("./authRoutes");

router.get("/", isAuthenticated, (req, res) => {
  res.json(sessions);
});

module.exports = router;
