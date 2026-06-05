const express = require("express");
const notificationService = require("../services/notificationService");

const router = express.Router();

router.get("/", async(req, res) => {
  const notifications = await notificationService.getNotifications();

  res.status(200).json(notifications);
});

module.exports = router;