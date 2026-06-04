const pool = require("../db/db");

const saveGoLive = async (
  partnerId,
  goLive
) => {
  const result = await pool.query(
    `
    INSERT INTO partner_go_live
    (
      partner_id,
      status,
      production_date,
      business_approval,
      technology_approval,
      operations_approval,
      rollback_plan_ready,
      notes
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      partnerId,
      goLive.status,
      goLive.productionDate || new Date().toISOString(),
      goLive.businessApproval,
      goLive.technologyApproval,
      goLive.operationsApproval,
      goLive.rollbackPlanReady,
      goLive.notes
    ]
  );

  return result.rows[0];
};

module.exports = {
  saveGoLive
};