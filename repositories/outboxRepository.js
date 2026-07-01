const pool = require("../db/db");

const saveOutboxEvent = async (event, topic) => {
  const result = await pool.query(
    `
    INSERT INTO event_outbox
    (
      event_id,
      topic,
      event_type,
      payload,
      status
    )
    VALUES ($1,$2,$3,$4,'PENDING')
    ON CONFLICT (event_id)
    DO UPDATE SET
      topic = EXCLUDED.topic,
      event_type = EXCLUDED.event_type,
      payload = EXCLUDED.payload,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
    `,
    [
      event.eventId,
      topic,
      event.eventType,
      JSON.stringify(event)
    ]
  );

  return result.rows[0];
};

const markPublished = async (eventId) => {
  await pool.query(
    `
    UPDATE event_outbox
    SET status = 'PUBLISHED',
        last_error = NULL,
        updated_at = CURRENT_TIMESTAMP
    WHERE event_id = $1
    `,
    [eventId]
  );
};

const markFailed = async (eventId, error) => {
  await pool.query(
    `
    UPDATE event_outbox
    SET status = 'FAILED',
        attempts = attempts + 1,
        last_error = $2,
        updated_at = CURRENT_TIMESTAMP
    WHERE event_id = $1
    `,
    [eventId, error.message]
  );
};

const getPendingEvents = async (limit = 25) => {
  const result = await pool.query(
    `
    SELECT *
    FROM event_outbox
    WHERE status IN ('PENDING', 'FAILED')
    ORDER BY created_at ASC
    LIMIT $1
    `,
    [limit]
  );

  return result.rows;
};

const getOutboxEvents = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM event_outbox
    ORDER BY created_at DESC
    `
  );

  return result.rows;
};

const markDeadLettered = async (eventId) => {
  await pool.query(
    `
    UPDATE event_outbox
    SET status = 'DEAD_LETTERED',
        updated_at = CURRENT_TIMESTAMP
    WHERE event_id = $1
    `,
    [eventId]
  );
};

module.exports = {
  saveOutboxEvent,
  markPublished,
  markFailed,
  getPendingEvents,
  getOutboxEvents,
  markDeadLettered
};
