const partners = require("../store/partnerStore");

const createPartner = (partnerRequest) => {
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

module.exports = {
  createPartner,
  getPartners,
  getPartnerById
};