const pool = require("../db/db");

const saveCertification = async (
  partnerId,
  certification
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const values = [
      partnerId,
      certification.status,
      JSON.stringify(
        certification.certifiedProducts || []
      ),
      certification.certificationDate ||
        new Date().toISOString(),
      certification.approver,
      certification.notes
    ];

    const result = await client.query(
      `
      INSERT INTO partner_certification
      (
        partner_id,
        status,
        certified_products,
        certification_date,
        approver,
        notes
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (partner_id)
      DO UPDATE SET
        status = EXCLUDED.status,
        certified_products = EXCLUDED.certified_products,
        certification_date = EXCLUDED.certification_date,
        approver = EXCLUDED.approver,
        notes = EXCLUDED.notes,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
      `,
      values
    );

    await client.query(
      `
      INSERT INTO partner_lifecycle_history
      (partner_id, stage, status, details)
      VALUES ($1,$2,$3,$4)
      `,
      [
        partnerId,
        "CERTIFICATION",
        certification.status,
        JSON.stringify(certification)
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
  saveCertification
};
