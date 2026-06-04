const partners = require("../store/partnerStore");
const auditHistory = require("../store/auditStore");

const createPartner = (partnerRequest) => {
  const existingPartner = getPartnerById(partnerRequest.partnerId);

  if (existingPartner) {

    return {

      error: true,

      statusCode: 409,

      message: "Partner already exists"

    };

  }

  const partner = {

    partnerId: partnerRequest.partnerId,

    partnerName: partnerRequest.partnerName,

    status: "REQUESTED",

    requestedProducts: partnerRequest.requestedProducts || [],

    createdAt: new Date().toISOString()

  };

  partners.push(partner);

  return partner;

};

const getPartners = () => {
  return partners;
};

const getPartnerById = (partnerId) => {
  return partners.find((partner) => partner.partnerId === partnerId);
};

const updatePartnerStatus = (partnerId, status) => {

  const partner = getPartnerById(partnerId);

  if (!partner) {

    return null;

  }

  partner.status = status;

  partner.updatedAt = new Date().toISOString();

  return partner;

};

const getPartnersByStatus = (status) => {

  return partners.filter(

    partner => partner.status === status

  );

};

const updateConnectivityStatus = (partnerId, connectivityRequest) => {
  const partner = getPartnerById(partnerId);

  if (!partner) {
    return null;
  }

  partner.connectivity = {
    status: connectivityRequest.status,
    sandboxAccess: connectivityRequest.sandboxAccess || false,
    ipWhitelisted: connectivityRequest.ipWhitelisted || false,
    certificateExchanged: connectivityRequest.certificateExchanged || false,
    apiGatewayAccess: connectivityRequest.apiGatewayAccess || false,
    notes: connectivityRequest.notes || "",
    updatedAt: new Date().toISOString()
  };

  partner.updatedAt = new Date().toISOString();
  addAuditRecord(
  partnerId,
  "CONNECTIVITY_UPDATED",
  connectivityRequest
);
  return partner;
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

const updateCertificationStatus = (partnerId, certificationRequest) => {
  const partner = getPartnerById(partnerId);

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

  return partner;
};

const updateGoLiveStatus = (partnerId, goLiveRequest) => {
  const partner = getPartnerById(partnerId);

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