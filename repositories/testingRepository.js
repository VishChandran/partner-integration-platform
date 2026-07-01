const pool = require("../db/db");

const saveTesting = async (
  partnerId,
  testing
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      INSERT INTO partner_testing
      (
        partner_id,
        status,
        total_test_cases,
        passed,
        failed,
        blocked,
        notes
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (partner_id)
      DO UPDATE SET
        status = EXCLUDED.status,
        total_test_cases = EXCLUDED.total_test_cases,
        passed = EXCLUDED.passed,
        failed = EXCLUDED.failed,
        blocked = EXCLUDED.blocked,
        notes = EXCLUDED.notes,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
      `,
      [
        partnerId,
        testing.status,
        testing.totalTestCases,
        testing.passed,
        testing.failed,
        testing.blocked,
        testing.notes
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
        "TESTING",
        testing.status,
        JSON.stringify(testing)
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
  saveTesting
};
