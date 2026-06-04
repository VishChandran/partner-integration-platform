const pool = require("../db/db");

const saveConnectivity = async (
  partnerId,
  connectivity
) => {

  const result = await pool.query(
    `
    INSERT INTO partner_connectivity
    (
      partner_id,
      status,
      sandbox_access,
      ip_whitelisted,
      certificate_exchanged,
      api_gateway_access,
      notes
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      partnerId,
      connectivity.status,
      connectivity.sandboxAccess,
      connectivity.ipWhitelisted,
      connectivity.certificateExchanged,
      connectivity.apiGatewayAccess,
      connectivity.notes
    ]
  );

  return result.rows[0];

};

module.exports = {
  saveConnectivity
};