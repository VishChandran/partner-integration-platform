const pool = require("../db/db");

const saveCertification = async (
  partnerId,
  certification
) => {
  const result = await pool.query(
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
    RETURNING *
    `,
    [
      partnerId,
      certification.status,
      JSON.stringify(
        certification.certifiedProducts || []
      ),
      certification.certificationDate ||
        new Date().toISOString(),
      certification.approver,
      certification.notes
    ]
  );

  return result.rows[0];
};

module.exports = {
  saveCertification
};
