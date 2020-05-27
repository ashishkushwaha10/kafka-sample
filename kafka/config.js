module.exports = {
    clientConfig: {
        kafkaHost: process.env.KAFKA_HOST,
        requestTimeout: 20000,
        connectTimeout: 20000,
        autoConnect: true
    },
    testConsumerConfig: {
        groupId: process.env.KAFKA_GROUP_ID,
        autoCommit: false,
        encoding: 'buffer'
    },
    producerConfig: {

    },
    testConsumerTopics: [
        {
            topic: process.env.KAFKA_TOPIC_CREATE,
            partition: 0
        }, {
            topic: process.env.KAFKA_TOPIC_CANCEL,
            partition: 0
        },
    ]
}