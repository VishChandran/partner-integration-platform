const express = require("express");
const partnerService = require("../services/partnerService");

const router = express.Router();

router.post("/", async (req, res) => {
  const partner = await partnerService.createPartner(req.body);

  if (partner.error) {
    return res.status(partner.statusCode).json({
      message: partner.message
    });
  }

  res.status(201).json(partner);
});

router.get("/", async (req, res) => {
  const partners = await partnerService.getPartners();

  res.status(200).json(partners);
});

router.get("/status/:status", (req, res) => {
  const partners = partnerService.getPartnersByStatus(req.params.status);

  res.status(200).json(partners);
});

router.patch("/:partnerId/status", async (req, res) => {
  const partner = await partnerService.updatePartnerStatus(
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

router.patch("/:partnerId/connectivity", async (req, res) => {
  const partner = await partnerService.updateConnectivityStatus(
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

router.patch("/:partnerId/testing", async (req, res) => {
  const partner = await partnerService.updateTestingStatus(
    req.params.partnerId,
    req.body
  );

  if (!partner) {
    return res.status(404).json({
      message: "Partner not found"
    });
  }

  if (partner.error) {
    return res.status(partner.statusCode).json({
      message: partner.message
    });
  }

  res.status(200).json(partner);
});

router.patch("/:partnerId/certification", async (req, res) => {
  const partner = await partnerService.updateCertificationStatus(
    req.params.partnerId,
    req.body
  );

  if (!partner) {
    return res.status(404).json({
      message: "Partner not found"
    });
  }

  if (partner.error) {
    return res.status(partner.statusCode).json({
      message: partner.message
    });
  }

  res.status(200).json(partner);
});

router.patch("/:partnerId/go-live", async (req, res) => {
  const partner = await partnerService.updateGoLiveStatus(
    req.params.partnerId,
    req.body
  );

  if (!partner) {
    return res.status(404).json({
      message: "Partner not found"
    });
  }

  if (partner.error) {
    return res.status(partner.statusCode).json({
      message: partner.message
    });
  }

  res.status(200).json(partner);
});

router.get("/:partnerId/history", (req, res) => {
  const history = partnerService.getAuditHistory(
    req.params.partnerId
  );

  res.status(200).json(history);
});
router.get("/:partnerId/full", async (req, res) => {
  const partner = await partnerService.getPartnerLifecycle(
    req.params.partnerId
  );

  if (!partner) {
    return res.status(404).json({
      message: "Partner not found"
    });
  }

  res.status(200).json(partner);
});

router.get("/:partnerId", async (req, res) => {
  const partner = await partnerService.getPartnerById(
    req.params.partnerId
  );

  if (!partner) {
    return res.status(404).json({
      message: "Partner not found"
    });
  }

  res.status(200).json(partner);
});

module.exports = router;