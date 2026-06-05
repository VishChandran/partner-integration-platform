const { Kafka } = require("kafkajs");
const config = require("../config/config");
const notificationHandler = require( "../services/notificationEventHandler");

const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: [config.kafka.broker]
});

const consumer = kafka.consumer({
  groupId: "partner-platform-group"
});

const startConsumer = async () => {

  await consumer.connect();
   console.log(

    "Kafka consumer connected"

  );

  await consumer.subscribe({
    topic: "partner-lifecycle-events",
    fromBeginning: true
  });
   console.log(

    "Subscribed to partner-lifecycle-events"

  );

  await consumer.run({
    eachMessage: async ({ message }) => {

      const event =
        JSON.parse(
          message.value.toString()
        );

      console.log(
        "Kafka Event Received:",
        event.eventType
      );
notificationHandler

        .processEvent(event);
    }
  });

};

module.exports = {
  startConsumer
};