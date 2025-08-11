const sequelize_connection = require("../configs/db-connection.config");
const { Sequelize, QueryTypes } = require("sequelize");
const Op = Sequelize.Op;
const { sendEmail } = require("../services/common.service");
const { parseStringPromise } = require('xml2js');
const path = require("path")
const fs = require("fs")
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const qs = require('qs');
const { MMI_CLIENT_ID, MMI_CLIENT_SECRET, MMI_AUTH_API, MMI_IOT_API } = require('../configs/env.config');

// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { AUTH_MESSAGES, COMMON_MESSAGES, ROUTE_MESSAGES, ERROR_CODES } = require("../constants/messages.constant");

// Services.
// const dbService = require("../services/db.service");
const redisService = require("../services/redis.service");

// Helpers.
const { getCurrentDate, getTimeZoneByBusOperatorID, prepareResponse, prepareListResponse, } = require("../helpers/common.helper");
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");
const { BAD_REQUEST, CREATED, NOT_FOUND, FORBIDDEN } = require("../constants/http-status-code.constant");
const { getMMIToken, getMMIData } = require("../services/gps.service");

const getGpsData = async (req, res) => {
    const { mobileNumber } = req.query;
    try {

        const responseToken = await getMMIToken();
        const accessToken = responseToken.data.access_token;

        const result = await getMMIData(accessToken);
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);

    } catch (error) {
        await logError(req, res, "GpsController", "GetGpsData", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

module.exports = {
    getGpsData
};
