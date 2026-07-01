const express = require("express");
const eventPublisher = require("../events/eventPublisher");
const outboxRepository = require("../repositories/outboxRepository");
const deadLetterRepository = require("../repositories/deadLetterRepository");

const router = express.Router();

router.get("/", async(req, res) => {
  const events = await eventPublisher.getEvents();

  res.status(200).json(events);
});

router.get("/outbox", async(req, res) => {
  const outboxEvents = await outboxRepository.getOutboxEvents();

  res.status(200).json(outboxEvents);
});

router.post("/outbox/retry", async(req, res) => {
  const results = await eventPublisher.retryPendingEvents();

  res.status(200).json(results);
});

router.get("/dead-letters", async(req, res) => {
  const deadLetters = await deadLetterRepository.getDeadLetters();

  res.status(200).json(deadLetters);
});

module.exports = router;
