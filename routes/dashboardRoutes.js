const express = require("express");

const router = express.Router();

const partnerService = require("../services/partnerService");

router.get("/", async (req, res) => {

  const summary =
    await partnerService.getDashboardSummary();

  res.status(200).json(summary);

});

module.exports = router;
