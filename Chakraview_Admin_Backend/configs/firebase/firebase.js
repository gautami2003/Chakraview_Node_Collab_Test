const axios = require('axios');
const { FIREBASE_API_KEY, FCM_SEND_MSG_URL } = require('../env.config');

class Firebase {
    constructor() {
        this.FCM_SEND_MSG_URL = FCM_SEND_MSG_URL;
    }

    send(to, message) {
        const fields = {
            to: to,
            notification: {
                title: 'Chakraview',
                body: message
            },
            data: {
                body: message
            }
        };
        return this.sendPushNotification(fields);
    }

    sendToTopic(to, message) {
        const fields = {
            to: `/topics/${to}`,
            data: message
        };
        return this.sendPushNotification(fields);
    }

    sendMultiple(registration_ids, message) {
        const fields = {
            to: registration_ids,
            data: message
        };
        return this.sendPushNotification(fields);
    }

    sendPushNotification(fields) {
        const headers = {
            'Authorization': 'key=' + FIREBASE_API_KEY,
            'Content-Type': 'application/json'
        };

        const options = {
            url: this.FCM_SEND_MSG_URL,
            method: 'POST',
            headers: headers,
            json: fields
        };

        return axios.post(this.FCM_SEND_MSG_URL, fields, { headers })
            .then(response => response.data)
            .catch(error => {
                throw new Error('Failed to send push notification: ' + error.message);
            });
    }
}

module.exports = Firebase;