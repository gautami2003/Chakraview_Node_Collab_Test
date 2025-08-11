const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const routeStoppageTimingService = require('../services/routeStoppageTiming.service');
// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");
const paginationConstant = require("../constants/pagination.constant");


const getAllStoppageTiming = async (req, res) => {
    const busOperatorId = req.user.busOperatorID;
    const { page } = req.query;
    try {
        const totalPage = parseInt(page) || 1;
        const totalLimit = parseInt(paginationConstant.LIMIT);;

        const getStoppageTiming = await routeStoppageTimingService.getAllStoppageTiming(busOperatorId, totalPage, totalLimit);

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { count: getStoppageTiming.count, totalLimit: totalLimit, result: getStoppageTiming.rows });
    } catch (error) {
        await logError(req, res, "routeStoppageTiming", "getAllStoppageTiming", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const createStoppageTiming = async (req, res) => {
    const { body } = req;
    const busOperatorId = req.user.busOperatorID;
    try {
        const data = await routeStoppageTimingService.createStoppageTiming(busOperatorId, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.TIME_ALREADY_ASSIGNED, {}, {}, false);
        }
    } catch (error) {
        await logError(req, res, "routeStoppageTiming", "createStoppageTiming", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateStoppageTiming = async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    const busOperatorId = req.user.busOperatorID;
    try {
        const data = await routeStoppageTimingService.updateStoppageTiming(busOperatorId, id, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.TIME_ALREADY_ASSIGNED);
        }

    } catch (error) {
        await logError(req, res, "routeStoppageTiming", "updateStoppageTiming", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deleteStoppageTiming = async (req, res) => {
    const { id } = req.params;
    try {

        let data = await routeStoppageTimingService.deleteStoppageTiming(id)

        if (data) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DELETE_ERROR;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "routeStoppageTiming", "deleteStoppageTiming", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};


module.exports = {
    getAllStoppageTiming,
    createStoppageTiming,
    updateStoppageTiming,
    deleteStoppageTiming,
};
