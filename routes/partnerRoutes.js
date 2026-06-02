const express = require("express");
const partnerService = require("../services/partnerService");

const router = express.Router();

router.post("/", (req, res) => {
  const partner = partnerService.createPartner(req.body);

  res.status(201).json(partner);
});

router.get("/", (req, res) => {
  const partners = partnerService.getPartners();

  res.status(200).json(partners);
});

router.get("/:partnerId", (req, res) => {
  const partner = partnerService.getPartnerById(req.params.partnerId);

  if (!partner) {
    return res.status(404).json({
      message: "Partner not found"
    });
  }

  res.status(200).json(partner);
});

module.exports = router;