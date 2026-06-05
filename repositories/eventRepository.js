const pool = require("../db/db");

const saveEvent = async (event) => {
  const result = await pool.query(
    `
    INSERT INTO partner_events
    (
      event_id,
      correlation_id,
      event_type,
      payload,
      published_at
    )
    VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT (event_id) DO NOTHING
    RETURNING *
    `,
    [
      event.eventId,
      event.correlationId,
      event.eventType,
      JSON.stringify(event.payload),
      event.publishedAt
    ]
  );

  return result.rows[0];
};

const getEvents = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM partner_events
    ORDER BY published_at DESC
    `
  );

  return result.rows;
};

module.exports = {
  saveEvent,
  getEvents
};