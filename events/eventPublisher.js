const events = require("../store/eventStore");

const publishEvent = (eventType, payload) => {
  const event = {
    eventId: `EVT-${Date.now()}`,
    eventType,
    payload,
    publishedAt: new Date().toISOString()
  };

  events.push(event);

  return event;
};

const getEvents = () => {
  return events;
};

module.exports = {
  publishEvent,
  getEvents
};