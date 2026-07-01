const pool = require("../db/db");

const saveDeadLetter = async ({
  eventId,
  source,
  topic,
  eventType,
  payload,
  error
}) => {
  const result = await pool.query(
    `
    INSERT INTO event_dead_letters
    (
      event_id,
      source,
      topic,
      event_type,
      payload,
      error_message
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
    `,
    [
      eventId,
      source,
      topic,
      eventType,
      JSON.stringify(payload),
      error.message
    ]
  );

  return result.rows[0];
};

const getDeadLetters = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM event_dead_letters
    ORDER BY failed_at DESC
    `
  );

  return result.rows;
};

module.exports = {
  saveDeadLetter,
  getDeadLetters
};
