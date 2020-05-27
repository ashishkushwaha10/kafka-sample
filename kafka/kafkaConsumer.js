'use strict';

const {Consumer, Offset, KafkaClient } = require('kafka-node');
const avsc = require('avsc');
const {clientConfig} = require('./config')
const registry = require('avro-schema-registry')(process.env.SCHEMA_REGISTRY);

class KafkaConsumer {
    constructor(consumerConfig, consumerTopic) {
        return (() => {
            this.client = KafkaConsumer.getKafkaClient();
            this.consumer = KafkaConsumer.getKafkaConsumer(this.client, consumerConfig, consumerTopic);
            this.offset = KafkaConsumer.getConsumerOffset(this.client);
            this.setOffsetParameter(this.offset, this.consumer);
            this.logConsumerReadyMessage();
            // this.setMessageHandler(KafkaConsumer.logMessage);
            this.setupErrorHandler(KafkaConsumer.logErrorArguments);
            return this;
        })();
    }

    static getConsumerOffset(client) {
        return new Offset(client);
    }

    logConsumerReadyMessage() {
        this.consumer.on('ready', () => console.log(`consumer ready`))
    }

    static getKafkaClient() {
        return new KafkaClient(clientConfig);
    }

    static getKafkaConsumer(client, consumerConfig, consumerTopic) {
        return new Consumer(client, consumerTopic, consumerConfig);
    }

    static logErrorArguments(args) {
        console.log(`Error in Kafka: ${JSON.stringify(args)}`);
    }

    setupErrorHandler(errorHandler) {
        this.consumer.on('error', (args) => errorHandler(args));
    }

    setMessageHandler(messageHandler) {
        this.consumer.on('message', (message) => messageHandler(message))
    }

    static logMessage(message) {
        console.log(`\n\nkafka message:  ${JSON.stringify(message)}\n\n`);
    }
    
    setOffsetParameter(offset, consumerr) {
        this.consumer.on('offsetOutOfRange', function (topic) {
            topic.maxNum = 2;
            offset.fetch([topic], function (err, offsets) {
                if (err) {
                    return console.error(err);
                }
                var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
                consumerr.setOffset(topic.topic, topic.partition, min);
            });
        });
    }

}

module.exports = KafkaConsumer;
