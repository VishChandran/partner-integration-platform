const pool = require("../db/db");

const saveGoLive = async (
  partnerId,
  goLive
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
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
      ON CONFLICT (partner_id)
      DO UPDATE SET
        status = EXCLUDED.status,
        production_date = EXCLUDED.production_date,
        business_approval = EXCLUDED.business_approval,
        technology_approval = EXCLUDED.technology_approval,
        operations_approval = EXCLUDED.operations_approval,
        rollback_plan_ready = EXCLUDED.rollback_plan_ready,
        notes = EXCLUDED.notes,
        updated_at = CURRENT_TIMESTAMP
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

    await client.query(
      `
      INSERT INTO partner_lifecycle_history
      (partner_id, stage, status, details)
      VALUES ($1,$2,$3,$4)
      `,
      [
        partnerId,
        "GO_LIVE",
        goLive.status,
        JSON.stringify(goLive)
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
  saveGoLive
};
