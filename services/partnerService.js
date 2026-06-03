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

module.exports = {
  createPartner,
  getPartners,
  getPartnerById,
  updatePartnerStatus,
  getPartnersByStatus
};