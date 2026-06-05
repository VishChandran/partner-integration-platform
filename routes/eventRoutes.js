const express = require("express");
const eventPublisher = require("../events/eventPublisher");

const router = express.Router();

router.get("/", async(req, res) => {
  const events = await eventPublisher.getEvents();

  res.status(200).json(events);
});

module.exports = router;