const partners = require("../store/partnerStore");
const auditHistory = require("../store/auditStore");
const eventPublisher = require("../events/eventPublisher");
const pool = require("../db/db");
const connectivityRepository = require("../repositories/connectivityRepository");
const testingRepository = require("../repositories/testingRepository");
const certificationRepository = require("../repositories/certificationRepository");
const goLiveRepository = require("../repositories/goLiveRepository");
const partnerLifecycleRepository = require("../repositories/partnerLifecycleRepository");

const createPartner = async (partnerRequest) => {

  const existingPartner =
    await getPartnerById(
      partnerRequest.partnerId
    );

  if (existingPartner) {

    return {
      error: true,
      statusCode: 409,
      message: "Partner already exists"
    };

  }

  const query = `
    INSERT INTO partners
    (
      partner_id,
      partner_name,
      status,
      requested_products
    )
    VALUES
    ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [
    partnerRequest.partnerId,
    partnerRequest.partnerName,
    "REQUESTED",
    JSON.stringify(
      partnerRequest.requestedProducts || []
    )
  ];

  const result =
    await pool.query(
      query,
      values
    );

  return result.rows[0];

};

const getPartners = async () => {

  const result =
    await pool.query(
      `
      SELECT *
      FROM partners
      ORDER BY created_at DESC
      `
    );

  return result.rows;

};

const getPartnerById = async (
  partnerId
) => {

  const result =
    await pool.query(
      `
      SELECT *
      FROM partners
      WHERE partner_id = $1
      `,
      [partnerId]
    );

  return result.rows[0];

};
const updatePartnerStatus = async (partnerId, status) => {
  const result = await pool.query(
    `
    UPDATE partners
    SET status = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE partner_id = $2
    RETURNING *
    `,
    [status, partnerId]
  );

  return result.rows[0];
};

const getPartnersByStatus = (status) => {

  return partners.filter(

    partner => partner.status === status

  );

};

const updateConnectivityStatus = async (partnerId, connectivityRequest) => {
  const partner = await getPartnerById(partnerId);

  if (!partner) {
    return null;
  }

  const savedConnectivity =

    await connectivityRepository.saveConnectivity(

      partnerId,

      connectivityRequest

    );

  addAuditRecord(

    partnerId,

    "CONNECTIVITY_UPDATED",

    connectivityRequest

  );

  return {

    partnerId,

    connectivity: savedConnectivity

  };

};
const updateTestingStatus = async (
  partnerId,
  testingRequest
) => {
  const partner = await getPartnerById(partnerId);

  if (!partner) {
    return null;
  }

  const savedTesting =
    await testingRepository.saveTesting(
      partnerId,
      testingRequest
    );

  addAuditRecord(
    partnerId,
    "TESTING_UPDATED",
    testingRequest
  );

  return {
    partnerId,
    testing: savedTesting
  };
};

const updateCertificationStatus = async (
  partnerId,
  certificationRequest
) => {

  const partner =
    await getPartnerById(partnerId);

  if (!partner) {
    return null;
  }

  const savedCertification =
    await certificationRepository.saveCertification(
      partnerId,
      certificationRequest
    );

  addAuditRecord(
    partnerId,
    "CERTIFICATION_UPDATED",
    certificationRequest
  );

  await eventPublisher.publishEvent(
    "PARTNER_CERTIFIED",
    {
      partnerId,
      certifiedProducts:
        certificationRequest.certifiedProducts
    }
  );

  return {
    partnerId,
    certification: savedCertification
  };

};

const updateGoLiveStatus = async (
  partnerId,
  goLiveRequest
) => {
  const partner = await getPartnerById(partnerId);

  if (!partner) {
    return null;
  }

  const savedGoLive =
    await goLiveRepository.saveGoLive(
      partnerId,
      goLiveRequest
    );

  addAuditRecord(
    partnerId,
    "GO_LIVE_UPDATED",
    goLiveRequest
  );

  await eventPublisher.publishEvent(
    "PARTNER_READY_FOR_GO_LIVE",
    {
      partnerId,
      productionDate: savedGoLive.production_date
    }
  );

  return {
    partnerId,
    goLive: savedGoLive
  };
};
const getDashboardSummary = () => {

  return {

    totalPartners: partners.length,

    requested: partners.filter(
      partner => partner.status === "REQUESTED"
    ).length,

    approved: partners.filter(
      partner => partner.status === "APPROVED"
    ).length,

    certified: partners.filter(
      partner =>
        partner.certification &&
        partner.certification.status === "CERTIFIED"
    ).length,

    productionReady: partners.filter(
      partner =>
        partner.goLive &&
        partner.goLive.status === "READY"
    ).length
    };
  };

  const addAuditRecord = (
  partnerId,
  action,
  details
) => {

  auditHistory.push({

    partnerId,

    action,

    details,

    timestamp: new Date().toISOString()

  });

};
const getAuditHistory = (
  partnerId
) => {

  return auditHistory.filter(
    record =>
      record.partnerId === partnerId
  );

};
const getPartnerLifecycle = async (partnerId) => {
  return await partnerLifecycleRepository.getPartnerLifecycle(
    partnerId
  );
};

module.exports = {
  createPartner,
  getPartners,
  getPartnerById,
  updatePartnerStatus,
  getPartnersByStatus,
  updateConnectivityStatus,
  updateTestingStatus,
  updateCertificationStatus,
  updateGoLiveStatus,
  getDashboardSummary,
  getAuditHistory,
  getPartnerLifecycle
};