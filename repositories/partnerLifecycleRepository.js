const pool = require("../db/db");

const getPartnerLifecycle = async (partnerId) => {
  const result = await pool.query(
    `
    SELECT
      p.partner_id,
      p.partner_name,
      p.status AS partner_status,
      p.requested_products,
      p.created_at,

      c.status AS connectivity_status,
      c.sandbox_access,
      c.ip_whitelisted,
      c.certificate_exchanged,
      c.api_gateway_access,

      t.status AS testing_status,
      t.total_test_cases,
      t.passed,
      t.failed,
      t.blocked,

      cert.status AS certification_status,
      cert.certified_products,
      cert.certification_date,
      cert.approver,

      gl.status AS go_live_status,
      gl.production_date,
      gl.business_approval,
      gl.technology_approval,
      gl.operations_approval,
      gl.rollback_plan_ready

    FROM partners p

    LEFT JOIN partner_connectivity c
      ON p.partner_id = c.partner_id

    LEFT JOIN partner_testing t
      ON p.partner_id = t.partner_id

    LEFT JOIN partner_certification cert
      ON p.partner_id = cert.partner_id

    LEFT JOIN partner_go_live gl
      ON p.partner_id = gl.partner_id

    WHERE p.partner_id = $1

    ORDER BY
      c.updated_at DESC,
      t.updated_at DESC,
      cert.updated_at DESC,
      gl.updated_at DESC

    LIMIT 1
    `,
    [partnerId]
  );

  return result.rows[0];
};

module.exports = {
  getPartnerLifecycle
};