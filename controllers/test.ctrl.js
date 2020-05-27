"use strict";

const { testCreateKey, testCreateValue, testCancelKey, testCancelValue } = require('../kafka/avsc');
const KafkaProducer = require('../kafka/kafkaProducer');
const KafkaConsumer = require('../kafka/kafkaConsumer');
const {logger} = require(`../logger`);
const registry = require('avro-schema-registry')(process.env.SCHEMA_REGISTRY);
const { testConsumerConfig, testConsumerTopics } = require('../kafka/config');
const testConsumer = new KafkaConsumer(testConsumerConfig, testConsumerTopics).consumer;

testConsumer.on('error', (err) => {
    logger.error(err);
    console.log(`error in test consumer.`);
})

testConsumer.on('message', (message) => {
    console.log(`raw message: ${JSON.stringify(message)}`);
    registry.decode(Buffer.from(message.value))
        .then((msg) => {
            console.log(`decoded message: ${msg}`);
            testConsumer.commit({ topic: message.topic, offset: message.offset + 1 }, (err, data) => {
                if (err) {
                    logger.error(err);
                    console.log(err);
                }
                console.log(`data: ${JSON.stringify(data)}`);
                console.log(`message commited.`);
            })
        })
        .catch(err => console.log(err))
});

class TestCtrl {
    constructor() {

    }

    create(body) {
        try {
            const kafkaProducer = new KafkaProducer();
            let keyMessage = body.id;
            return kafkaProducer.produceMessage(
                'test.create',
                {
                    key: testCreateKey,
                    value: testCreateValue
                },
                {
                    key: { id: keyMessage },
                    value: { data : JSON.stringify(body) }
                }
            ).then(message => {
                Promise.resolve(message);
            })
            .catch(err => {
                    logger.error(err);
                    console.log(err);
                    return Promise.reject(err)
                })
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        }
    }

    cancel(body) {
        try {
            const kafkaProducer = new KafkaProducer();
            let keyMessage = body.id

            kafkaProducer.produceMessage(
                'test.cancel',
                {
                    key: testCancelKey,
                    value: testCancelValue
                },
                {
                    key: { id: keyMessage },
                    value: { data: JSON.stringify(body) }
                }
            ).then(Promise.resolve)
                .catch(err => {
                    logger.error(err);
                    console.log(err);
                    return Promise.reject(err)
                })
        } catch (err) {
            logger.error(err);
            Promise.reject(err);
        }
    }

}

module.exports = TestCtrl;