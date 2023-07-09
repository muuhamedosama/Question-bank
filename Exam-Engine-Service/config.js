const { Kafka } = require('kafkajs');
require('dotenv').config();

const messages = require('./utils/messages.json');

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [ process.env.KAFKA_BROKER ]
});

const pushNotification = async (topic, message) => {
  const producer = kafka.producer();

  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [
        { value: JSON.stringify(message) }
      ]
    });

  } catch (error) {
    console.error(messages.error.server.sendMessage);
  } finally {
    await producer.disconnect();
  }
};

exports.pushNotification = pushNotification;
