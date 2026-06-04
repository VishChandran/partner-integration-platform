const partners = require("../store/partnerStore");
const auditHistory = require("../store/auditStore");
const eventPublisher = require("../events/eventPublisher");
const pool = require("../db/db");
const connectivityRepository = require("../repositories/connectivityRepository");

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
const updateTestingStatus = (partnerId, testingRequest) => {
  const partner = getPartnerById(partnerId);

  if (!partner) {
    return null;
  }

  if (
    testingRequest.status === "IN_PROGRESS" &&
    (!partner.connectivity || partner.connectivity.status !== "COMPLETED")
  ) {
    return {
      error: true,
      statusCode: 400,
      message: "Connectivity must be completed before testing can start"
    };
  }

  partner.testing = {
    status: testingRequest.status,
    totalTestCases: testingRequest.totalTestCases || 0,
    passed: testingRequest.passed || 0,
    failed: testingRequest.failed || 0,
    blocked: testingRequest.blocked || 0,
    notes: testingRequest.notes || "",
    updatedAt: new Date().toISOString()
  };

  partner.updatedAt = new Date().toISOString();
  
  addAuditRecord(
  partnerId,
  "TESTING_UPDATED",
  testingRequest
);
  return partner;
};

const updateCertificationStatus = async (partnerId, certificationRequest) => {
  const partner = await getPartnerById(partnerId);

  if (!partner) {
    return null;
  }

  if (
    certificationRequest.status === "CERTIFIED" &&
    (!partner.testing || partner.testing.status !== "PASSED")
  ) {
    return {
      error: true,
      statusCode: 400,
      message: "Testing must be passed before certification can be completed"
    };
  }

  partner.certification = {
    status: certificationRequest.status,
    certifiedProducts: certificationRequest.certifiedProducts || [],
    certificationDate:
  certificationRequest.certificationDate ||
  (
    certificationRequest.status === "CERTIFIED"
      ? new Date().toISOString()
      : null
  ),
    approver: certificationRequest.approver || "",
    notes: certificationRequest.notes || "",
    updatedAt: new Date().toISOString()
  };

  partner.updatedAt = new Date().toISOString();
  
  addAuditRecord(
  partnerId,
  "CERTIFICATION_UPDATED",
  certificationRequest
);
if (partner.certification.status === "CERTIFIED") {
  await eventPublisher.publishEvent(
    "PARTNER_CERTIFIED",
    {
      partnerId: partner.partner_id,
      partnerName: partner.partner_name,
      certifiedProducts: partner.certification.certifiedProducts,
      certificationDate: partner.certification.certificationDate
    }
  );
}
  return partner;
};

const updateGoLiveStatus = async (partnerId, goLiveRequest) => {
  const partner = await getPartnerById(partnerId);

  if (!partner) {
    return null;
  }

  if (
    goLiveRequest.status === "READY" &&
    (!partner.certification || partner.certification.status !== "CERTIFIED")
  ) {
    return {
      error: true,
      statusCode: 400,
      message: "Certification must be completed before go-live readiness"
    };
  }

  partner.goLive = {
    status: goLiveRequest.status,
    productionDate:
  goLiveRequest.productionDate ||
  (
    goLiveRequest.status === "READY"
      ? new Date().toISOString()
      : null
  ),
    businessApproval: goLiveRequest.businessApproval || false,
    technologyApproval: goLiveRequest.technologyApproval || false,
    operationsApproval: goLiveRequest.operationsApproval || false,
    rollbackPlanReady: goLiveRequest.rollbackPlanReady || false,
    notes: goLiveRequest.notes || "",
    updatedAt: new Date().toISOString()
  };

  partner.updatedAt = new Date().toISOString();

  addAuditRecord(
  partnerId,
  "GO_LIVE_UPDATED",
  goLiveRequest
);
if (partner.goLive.status === "READY") {
  await eventPublisher.publishEvent(
    "PARTNER_READY_FOR_GO_LIVE",
    {
      partnerId: partner.partner_id,
      partnerName: partner.partner_name,
      productionDate: partner.goLive.productionDate
    }
  );
}
  return partner;
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
  getAuditHistory
};