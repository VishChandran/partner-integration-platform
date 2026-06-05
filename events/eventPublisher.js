const events = require("../store/eventStore");
const kafkaProducer = require("../kafka/kafkaProducer");
const eventRepository = require("../repositories/eventRepository");

const publishEvent = async (eventType, payload) => {
 const event = {
  eventId: `EVT-${Date.now()}`,
  correlationId: payload.correlationId || `CORR-${Date.now()}`,
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