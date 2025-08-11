const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
const qs = require('qs');
const axios = require('axios');
const { MMI_CLIENT_ID, MMI_CLIENT_SECRET, MMI_AUTH_API, MMI_IOT_API } = require('../configs/env.config');

const getMMIToken = async () => {
    const data = qs.stringify({
        grant_type: "client_credentials",
        client_id: MMI_CLIENT_ID,
        client_secret: MMI_CLIENT_SECRET
    });

    return responsetoken = await axios.post(MMI_AUTH_API, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

}
const getMMIData = async (accessToken) => {
    const response = await axios.get(MMI_IOT_API, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return result = response.data.data;
}

module.exports = {
    getMMIToken,
    getMMIData,
};