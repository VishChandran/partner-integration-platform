const express = require("express");
const eventPublisher = require("../events/eventPublisher");

const router = express.Router();

router.get("/", (req, res) => {
  const events = eventPublisher.getEvents();

  res.status(200).json(events);
});

module.exports = router;