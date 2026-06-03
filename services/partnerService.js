const partners = require("../store/partnerStore");

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

  return partner;
};
const updateTestingStatus = (partnerId, testingRequest) => {
  const partner = getPartnerById(partnerId);

  if (!partner) {
    return null;
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

  return partner;
};

module.exports = {
  createPartner,
  getPartners,
  getPartnerById,
  updatePartnerStatus,
  getPartnersByStatus,
  updateConnectivityStatus,
  updateTestingStatus
};