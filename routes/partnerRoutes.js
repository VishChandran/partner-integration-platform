const express = require("express");
const partnerService = require("../services/partnerService");

const router = express.Router();

router.post("/", (req, res) => {
  const partner = partnerService.createPartner(req.body);

  if (partner.error) {
    return res.status(partner.statusCode).json({
      message: partner.message
    });
  }

  res.status(201).json(partner);
});

router.get("/", (req, res) => {
  const partners = partnerService.getPartners();

  res.status(200).json(partners);
});

router.get("/status/:status", (req, res) => {
  const partners = partnerService.getPartnersByStatus(req.params.status);

  res.status(200).json(partners);
});

router.patch("/:partnerId/status", (req, res) => {
  const partner = partnerService.updatePartnerStatus(
    req.params.partnerId,
    req.body.status
  );

  if (!partner) {
    return res.status(404).json({
      message: "Partner not found"
    });
  }

  res.status(200).json(partner);
});

router.patch("/:partnerId/connectivity", (req, res) => {
  const partner = partnerService.updateConnectivityStatus(
    req.params.partnerId,
    req.body
  );

  if (!partner) {
    return res.status(404).json({
      message: "Partner not found"
    });
  }

  res.status(200).json(partner);
});
router.patch("/:partnerId/testing", (req, res) => {
  const partner = partnerService.updateTestingStatus(
    req.params.partnerId,
    req.body
  );

  if (!partner) {
    return res.status(404).json({
      message: "Partner not found"
    });
  }

  res.status(200).json(partner);
});
router.patch("/:partnerId/certification", (req, res) => {
  const partner = partnerService.updateCertificationStatus(
    req.params.partnerId,
    req.body
  );

  if (!partner) {
    return res.status(404).json({
      message: "Partner not found"
    });
  }

  res.status(200).json(partner);
});

router.patch("/:partnerId/go-live", (req, res) => {
  const partner = partnerService.updateGoLiveStatus(
    req.params.partnerId,
    req.body
  );

  if (!partner) {
    return res.status(404).json({
      message: "Partner not found"
    });
  }

  res.status(200).json(partner);
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