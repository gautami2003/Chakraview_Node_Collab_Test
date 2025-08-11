const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const countryService = require('../services/country.service');
// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");


const getCountry = async (req, res) => {

    try {

        const getCountry = await countryService.getCountry();

        const result = getCountry.map((data) => ({
            countryID: data.CountryID,
            countryName: data.CountryName,
        }));

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    } catch (error) {
        await logError(req, res, "country", "getCountry", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

module.exports = {
    getCountry
};
