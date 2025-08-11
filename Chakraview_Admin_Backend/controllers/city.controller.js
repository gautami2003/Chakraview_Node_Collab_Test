const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const CityService = require('../services/City.service');
// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");


const getCity = async (req, res) => {
    const { id } = req.query;
    try {

        const getCity = await CityService.getCity(id);
        console.log(getCity);

        const result = getCity.map((data) => ({
            CityID: data.CityID,
            CityName: data.CityName,
        }));

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    } catch (error) {
        await logError(req, res, "City", "getCity", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

module.exports = {
    getCity
};
