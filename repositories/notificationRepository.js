const pool = require("../db/db");

const saveNotification = async (notification) => {
  const result = await pool.query(
    `
    INSERT INTO partner_notifications
    (
      notification_id,
      notification_type,
      recipient,
      message,
      source_event,
      status,
      created_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    ON CONFLICT (notification_id) DO NOTHING
    RETURNING *
    `,
    [
      notification.notificationId,
      notification.notificationType,
      notification.recipient,
      notification.message,
      JSON.stringify(notification.sourceEvent),
      notification.status,
      notification.createdAt
    ]
  );

  return result.rows[0];
};

const getNotifications = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM partner_notifications
    ORDER BY created_at DESC
    `
  );

  return result.rows;
};

module.exports = {
  saveNotification,
  getNotifications
};