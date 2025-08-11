const { createMqttConnection } = require('../../configs/rabbitmq.config');
const { listenErrorEmail, listenGPS } = require('../../helpers/rabbitmq.helper');


const makeMQTTConnection = async () => {
    const mqttClient = await createMqttConnection();
    listenErrorEmail(mqttClient)
    listenGPS(mqttClient)

};

makeMQTTConnection();
