const { MQTT_USERNAME, MQTT_PASSWORD, MQTT_BROKER_PORT, MQTT_BROKER_HOST } = require('./env.config');

const mqtt = require('mqtt');
const uuid = require('uuid');

let mqttClientObj = null;

const createMqttConnection = async () => {
    if (mqttClientObj) {
        return mqttClientObj;
    } else {
        return new Promise((resolve, reject) => {
            const clientID = `ClientID_${uuid.v4()}`;

            mqttClientObj = mqtt.connect(`mqtt://${MQTT_BROKER_HOST}:${MQTT_BROKER_PORT}`, {
                username: MQTT_USERNAME,
                password: MQTT_PASSWORD,
                clientId: clientID,
                protocolId: 'MQTT',
                protocolVersion: 4,
                clean: true,
                reconnectPeriod: 1000
            });

            mqttClientObj.on('connect', () => {
                console.log('Connected to MQTT broker');
                resolve(mqttClientObj);
            });

            mqttClientObj.on('error', (error) => {
                console.error('MQTT connection error:', error);
                reject(error);
            });
        });
    }
};

module.exports = {
    createMqttConnection,
};

