const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const busStoppageService = require('../services/busStoppage.service');
// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");
const paginationConstant = require("../constants/pagination.constant");


const getAllBusStoppage = async (req, res) => {
    const busOperatorId = req.user.busOperatorID;
    const { page } = req.query;
    try {
        const totalPage = parseInt(page) || 1;
        const totalLimit = parseInt(paginationConstant.LIMIT);

        const getDropRoute = await busStoppageService.getAllBusStoppage(busOperatorId, totalPage, totalLimit);

        const result = getDropRoute.rows.map((data) => ({
            stoppageID: data.StoppageID,
            stopageName: data.StopageName,
            location: data.Location,
            countryName: data?.country_master?.CountryName,
            address: `${data.Address1},${data.Address2}`,
            cityName: data?.city_master?.CityName,
            pincode: data.Pincode,
            latitude: data.Latitude,
            longitude: data.Longitude,
        }));

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { count: getDropRoute.count, totalLimit: totalLimit, result });
    } catch (error) {
        await logError(req, res, "busStoppage", "getAllBusStoppage", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const createBusStoppage = async (req, res) => {
    const { body } = req;
    const busOperatorId = req.user.busOperatorID;
    try {
        const data = await busStoppageService.createBusStoppage(busOperatorId, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.STOPPAGE_NAME_EXISTS, {}, {}, false);
        }
    } catch (error) {
        await logError(req, res, "busStoppage", "createBusStoppage", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateBusStoppage = async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    const busOperatorId = req.user.busOperatorID;
    try {
        const data = await busStoppageService.updateBusStoppage(busOperatorId, id, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.STOPPAGE_NAME_EXISTS);
        }

    } catch (error) {
        await logError(req, res, "busStoppage", "updateBusStoppage", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deleteBusStoppage = async (req, res) => {
    const { id } = req.params;
    try {

        let data = await busStoppageService.deleteBusStoppage(id)

        if (data) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DELETE_ERROR;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "busStoppage", "deleteBusStoppage", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};


module.exports = {
    getAllBusStoppage,
    createBusStoppage,
    updateBusStoppage,
    deleteBusStoppage,
};
