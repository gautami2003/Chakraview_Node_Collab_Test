const { createMqttConnection } = require('../configs/rabbitmq.config');
const { sendEmail } = require('../services/common.service');
const { DB_MODELS } = require('../constants/models.constant');
const dbService = require('../services/db.service');

const postMqttMessage = async function (topic, message) {
    try {
        const mqttClient = await createMqttConnection();
        if (topic && message) {
            mqttClient.publish(topic, message, { retain: true }, (error) => {
                if (error) {
                    console.error('Error posting MQTT message:', error);
                    return 'Failed to post MQTT message';
                } else {
                    console.log('MQTT message posted successfully');
                    return 'MQTT message posted successfully';
                }
            });
        } else {
            return 'Topic and message are required.';
        }
    } catch (error) {
        console.log(error);
    }
};

let listenErrorEmail = async function (connection) {
    try {

        connection.subscribe('error_emails', (err) => {
            if (!err) {
                console.log('Subscribed to error/email topic');
            } else {
                console.log(err);
            }
        });

        connection.on('message', async (topic, message) => {
            if (topic === 'error_emails') {
                console.log("Hello!", JSON.parse(message.toString()));

                // let receivedMsg = JSON.parse(message.toString());
                // const errorData = await dbService.findOne(DB_MODELS.Api_Error_Logs, { id: receivedMsg.id }, ['request_url', 'request_payload', 'function', 'message', 'stack']);

                // const request_url = errorData.request_url;
                // const request_payload = errorData.request_payload;
                // const functionname = errorData.function;
                // const errorMessage = errorData.message;
                // const stack = errorData.stack;

                // //@Todo eEnable this once go live.
                // await sendEmail({ subject: 'Chakraview Error Alerts', html: `<b>RequestUrl</b> : ${request_url} <br/><br/>  <b>RequestedPayload</b> : ${request_payload}<br/><br/> <b>FunctionName</b> : ${functionname}<br/><br/> <b>Error</b> : ${errorMessage}<br/><br/><b>Stack</b> : ${stack}` });
            }
        });
    } catch (error) {
        console.log(error)
    }
}

let listenGPS = async function (connection) {
    try {

        connection.subscribe('gps_test', (err) => {
            if (!err) {
                console.log('Subscribed gps_test topic');
            } else {
                console.log(err);
            }
        });

        connection.on('message', async (topic, message) => {


            if (topic === 'gps_test') {
                console.log("Hello-------------!", JSON.parse(message.toString()));

            }
        });
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    listenErrorEmail,
    postMqttMessage,
    listenGPS
};