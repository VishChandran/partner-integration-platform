const { Kafka } = require("kafkajs");
const config = require("../config/config");

const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: [config.kafka.broker]
});

const producer = kafka.producer();

let isConnected = false;

const connectProducer = async () => {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
  }
};

const publishKafkaEvent = async (
  topic,
  event
) => {
  await connectProducer();

  await producer.send({
    topic,
    messages: [
      {
        key: event.eventId,
        value: JSON.stringify(event)
      }
    ]
  });
};

module.exports = {
  publishKafkaEvent
};