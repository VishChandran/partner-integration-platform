const pool = require("../db/db");

const saveConnectivity = async (
  partnerId,
  connectivity
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
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
      ON CONFLICT (partner_id)
      DO UPDATE SET
        status = EXCLUDED.status,
        sandbox_access = EXCLUDED.sandbox_access,
        ip_whitelisted = EXCLUDED.ip_whitelisted,
        certificate_exchanged = EXCLUDED.certificate_exchanged,
        api_gateway_access = EXCLUDED.api_gateway_access,
        notes = EXCLUDED.notes,
        updated_at = CURRENT_TIMESTAMP
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

    await client.query(
      `
      INSERT INTO partner_lifecycle_history
      (partner_id, stage, status, details)
      VALUES ($1,$2,$3,$4)
      `,
      [
        partnerId,
        "CONNECTIVITY",
        connectivity.status,
        JSON.stringify(connectivity)
      ]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

};

module.exports = {
  saveConnectivity
};
