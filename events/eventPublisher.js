const events = require("../store/eventStore");
const crypto = require("crypto");
const kafkaProducer = require("../kafka/kafkaProducer");
const eventRepository = require("../repositories/eventRepository");

const publishEvent = async (eventType, payload) => {
 const event = {
  eventId: `EVT-${crypto.randomUUID()}`,
  correlationId: payload.correlationId || `CORR-${crypto.randomUUID()}`,
  eventType,
  payload,
  publishedAt: new Date().toISOString()
};

  events.push(event);
  await eventRepository.saveEvent(event);

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

const getEvents = async() => {
  return await eventRepository.getEvents();
};

module.exports = {
  publishEvent,
  getEvents
};
