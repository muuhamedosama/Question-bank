const { Kafka } = require('kafkajs');
require('dotenv').config();

const messages = require('./utils/messages.json');

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [ process.env.KAFKA_BROKER ]
});

const receiveNotifications = async callback => {
  const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const value = JSON.parse(message.value.toString());
        callback(value);
      }
    });
  } catch (error) {
    console.error(messages.error.server.receiveMessages);
  }
}

module.exports = receiveNotifications;
