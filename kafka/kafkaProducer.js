"use strict";

const { Producer, KafkaClient, KeyedMessage } = require('kafka-node'),
    avsc = require('avsc'),
    registry = require('avro-schema-registry')(process.env.SCHEMA_REGISTRY);

class KafkaProducer {
    constructor() {
        return (() => {
            this.client = KafkaProducer.getKafkaClient();
            this.producer = KafkaProducer.getKafkaProducer(this.client);
            this.setupErrorHandler(KafkaProducer.logErrorArguments);
            return this;
        })();
    }

    static getKafkaClient() {
        return new KafkaClient({ kafkaHost: process.env.KAFKA_HOST, requestTimeout: 20000, connectTimeout: 20000, autoConnect: true });
    }

    static getKafkaProducer(client) {
        return new Producer(client, { requireAcks: 1 });
    }

    static logErrorArguments(args) {
        console.log(`Error in Kafka: ${JSON.stringify(args)}`);
    }

    encodeKey(topic, schema, msg) {
        return new Promise((resolve, reject) => {
            return registry.encodeKey(topic, JSON.stringify(schema), msg)
                .then(key => resolve(key))
                .catch(err => { console.log(`err in encode key function ${err}`); return reject(err)})
        })
    }

    encodeMessage(topic, schema, msg) {
        return new Promise((resolve, reject) => {
            return registry.encodeMessage(topic, JSON.stringify(schema), msg)
                .then(value => {
                    resolve(value)
                })
                .catch(err => {console.log(`err in encode message function ${err}`); return reject(err)})
        })
    }

    setupErrorHandler(errorHandler) {
        this.producer.on('error', (args) => errorHandler(args));
    }

    produceMessage(topic, schemas, messages) {
        return new Promise((resolve, reject) => {
            try {
                this.producer.on('ready', async () => {
                    let key = await this.encodeKey(topic, schemas.key, messages.key);
                    let value = await this.encodeMessage(topic, schemas.value, messages.value);
                    let keyedMessage = new KeyedMessage(key, value);
                    let payload = [{
                        topic: topic,
                        messages: keyedMessage
                    }];
                    this.producer.send(payload, function (err, data) {
                        if (err) {
                            console.log(`err: ${err}`);
                            return reject(err);
                        }
                        console.log(`data: ${JSON.stringify(data)}`);
                        return resolve(data);
                    });
                });
            } catch (err) {
                console.log(`err in catch: ${JSON.stringify(err)}`);
                return reject(err);
            }
        })
    }


}

module.exports = KafkaProducer;