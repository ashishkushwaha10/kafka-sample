1. clone the project and install the required packages using `npm install` command.


2. Download standalone `zookeeper`, `kafka` and `schema-registry` packages or download the confluent self-managed software which contains all of them from https://www.confluent.io/download (Java/JRE is required for this to run.)


3. Extract the .zip/.tar.gz file, go to the confluent directory and run the following services:
  - zookeeper: `bin/zookeeper-server-start etc/kafka/zookeeper.properties`
    - by default, zookeeper will run on port 2181.

  - kafka: `bin/kafka-server-start etc/kafka/server.properties`
    - by default, zookeeper will run on port 9092.
    - we can also run kafka on cluster mode by running more kafka servers with different server.properties and different ports.

  - avro-schema-registry: `bin/schema-registry-start etc/schema-registry/schema-registry.properties`
    - by default, zookeeper will run on port 8081.
    - Go to http://localhost:8081/subjects to check if the schema exists. At the first run, it should give `[]` as output.


4. Topics related command:
  - create topic: `bin/kafka-topics --bootstrap-server localhost:9092 --create --topic 'topic.name' --partitions 1 --replication-factor 1`
    - `--bootstrap-server` is required. value will be `kafka_host:port`, if running multiple kafka servers, then `kafka_host:port,kafka_host1:port,kafka_host3:port`.
    - `--create` is required if creating a new topics.
    - `--topic` is required while creating, deleting new topics.
    - `--partitions` is number of partitions you want to create for a given topic.
    - `--replication-factor` will replicate the messages in different partition for a given topic. it should be smaller/equal than `--partitions` and `bootstrap-server` value. ie if there is only one kafka server running, `--replication-factor` will be 1.

  - list topics: `bin/kafka-topics --bootstrap-server localhost:9092 --list`
    - list all the topics.

  - checking topic properties: `bin/kafka-topics --bootstrap-server localhost:9092 --describe`.
    - This will give us partitions, replications and leader data for different topics.

  - deleting topic: `bin/kafka-topics --bootstrap-server localhost:9092 --delete --topic 'topic.name'`


5. create "test.create" and "test.cancel" topics using 4th step.


6. Now run `kafka-console-consumer` to open consumer window.
  - `bin/kafka-console-consumer --bootstrap-server localhost:9092 --topic "topic.name" --group ""consumer.group`



7. Now run the cloned project using `npm start` command. (install `nodemon` globally before running `npm start`)
    - This will start our node.js server on PORT 5000.
    - It will create log files if it doesn't exists.
    - Consumer will try to listen to kafka-topic on server start, so we created our topics before starting the server. Else we would have got meta data error.

8. Open `Postman` API testing app, and hit the following:
    - To create message for topic "test.create"
      Method: 'POST',
      URI: `http://localhost:5000/test/create`,
      body: { "id": 1, "name": "ashish"}

      response: { "success": true, "message": "kafka create message sent successfully." }

    - To create message for topic "test.cancel"
        Method: 'POST',
        URI: `http://localhost:5000/test/cancel`,
        body: { "id": 1, "name": "ashish"}
        response: { "success": true, "message": "kafka create message sent successfully." }


9. check `kafka-console-consumer` window if message is received. 


10. We are just commiting the message back to kafka server telling it that message was received.