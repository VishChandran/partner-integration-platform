const events = require("../store/eventStore");
const kafkaProducer = require("../kafka/kafkaProducer");

const publishEvent = async (eventType, payload) => {
  const event = {
    eventId: `EVT-${Date.now()}`,
    eventType,
    payload,
    publishedAt: new Date().toISOString()
  };

  events.push(event);

  try {
    await kafkaProducer.publishKafkaEvent(
      "partner-lifecycle-events",
      event
    );
  } catch (error) {
    console.error(
      "Failed to publish event to Kafka",
      error.message
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