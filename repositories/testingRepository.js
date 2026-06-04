const pool = require("../db/db");

const saveTesting = async (
  partnerId,
  testing
) => {
  const result = await pool.query(
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

  return result.rows[0];
};

module.exports = {
  saveTesting
};