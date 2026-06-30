const notifications = require("../store/notificationStore");
const crypto = require("crypto");
const notificationRepository = require("../repositories/notificationRepository");

const createNotification = async(
  notificationType,
  recipient,
  message,
  sourceEvent
) => {
  const notification = {
    notificationId: `NTF-${crypto.randomUUID()}`,
    notificationType,
    recipient,
    message,
    sourceEvent,
    status: "CREATED",
    createdAt: new Date().toISOString()
  };

  notifications.push(notification);
  await notificationRepository.saveNotification(notification);

  return notification;
};

const getNotifications = async() => {
  return await notificationRepository.getNotifications();

};

module.exports = {
  createNotification,
  getNotifications
};
