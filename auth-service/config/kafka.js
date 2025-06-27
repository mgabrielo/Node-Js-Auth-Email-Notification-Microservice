const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "auth-service",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const { sendWelcomeEmail } = require("../email-notification/email-service");

const consumer = kafka.consumer({ groupId: "email-group" });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-registered", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const user = JSON.parse(message.value.toString());
      await sendWelcomeEmail(user);
    },
  });
};

runConsumer();

module.exports = { producer, consumer };
