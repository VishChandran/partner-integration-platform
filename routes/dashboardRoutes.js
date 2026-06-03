const express = require("express");

const router = express.Router();

const partnerService = require("../services/partnerService");

router.get("/", (req, res) => {

  const summary =
    partnerService.getDashboardSummary();

  res.status(200).json(summary);

});

module.exports = router;