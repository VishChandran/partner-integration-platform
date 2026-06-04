const notifications = require("../store/notificationStore");

const createNotification = (
  notificationType,
  recipient,
  message,
  sourceEvent
) => {
  const notification = {
    notificationId: `NTF-${Date.now()}`,
    notificationType,
    recipient,
    message,
    sourceEvent,
    status: "CREATED",
    createdAt: new Date().toISOString()
  };

  notifications.push(notification);

  return notification;
};

const getNotifications = () => {
  return notifications;
};

module.exports = {
  createNotification,
  getNotifications
};