const events = require("../store/eventStore");
const notificationService = require("../services/notificationService");

const publishEvent = (eventType, payload) => {
  const event = {
    eventId: `EVT-${Date.now()}`,
    eventType,
    payload,
    publishedAt: new Date().toISOString()
  };

  events.push(event);
  if (eventType === "PARTNER_CERTIFIED") {
  notificationService.createNotification(
    "EMAIL",
    "partner-operations@bank.com",
    `Partner ${payload.partnerName} has been certified.`,
    event
  );
}

if (eventType === "PARTNER_READY_FOR_GO_LIVE") {
  notificationService.createNotification(
    "EMAIL",
    "production-readiness@bank.com",
    `Partner ${payload.partnerName} is ready for go-live.`,
    event
  );
}

  return event;
};

const getEvents = () => {
  return events;
};

module.exports = {
  publishEvent,
  getEvents
};