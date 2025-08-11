const axios = require('axios');
const { NOTIFICATION_API_KEY, NOTI_API_URL } = require('../configs/env.config');

const notificationAlert = async (payload) => {
    try {
        const data = { alert: payload };
        const config = {
            headers: {
                'x-api-key': NOTIFICATION_API_KEY,
                'Content-Type': 'application/json',
            },
        };

        const res = await axios.post(NOTI_API_URL, data, config);
        return res;

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    notificationAlert
};

