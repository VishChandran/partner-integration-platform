const express = require("express");
const notificationService = require("../services/notificationService");

const router = express.Router();

router.get("/", (req, res) => {
  const notifications = notificationService.getNotifications();

  res.status(200).json(notifications);
});

module.exports = router;