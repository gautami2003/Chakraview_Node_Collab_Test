const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const feesCollectionZoneWiseService = require('../services/feesCollectionZoneWise.service');
// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");
const paginationConstant = require("../constants/pagination.constant");


const getFeesCollectionZoneWise = async (req, res) => {
    const busOperatorId = req.user.busOperatorID;
    const { query } = req;
    try {
        const totalPage = parseInt(query.page) || 1;
        const totalLimit = parseInt(paginationConstant.LIMIT);
        const getFeesCollectionZoneWise = await feesCollectionZoneWiseService.getFeesCollectionZoneWise(query, busOperatorId, totalPage, totalLimit)

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { count: getFeesCollectionZoneWise.count, totalLimit: totalLimit, totalGrossAmount: getFeesCollectionZoneWise.totalGrossAmount, totalPaidAmount: getFeesCollectionZoneWise.totalPaidAmount, result: getFeesCollectionZoneWise.rows });
    } catch (error) {
        await logError(req, res, "FeesCollectionZoneWiseController", "getFeesCollectionZoneWise", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const createFeesCollectionZoneWise = async (req, res) => {
    const { body } = req;
    const busOperatorID = req.user.busOperatorID
    try {
        let data = await feesCollectionZoneWiseService.createFeesCollectionZoneWise(body, busOperatorID)

        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);
        }
        else {
            return apiHelper.success(res, COMMON_MESSAGES.DUPLICATE_RESOURCE, {}, {}, false);
        }
    } catch (error) {
        await logError(req, res, "FeesCollectionZoneWiseController", "createFeesCollectionZoneWise", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateFeesCollectionZoneWise = async (req, res) => {
    const { body } = req;
    const { id } = req.params;

    try {
        let data = await feesCollectionZoneWiseService.updateFeesCollectionZoneWise(id, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.DUPLICATE_RESOURCE, {}, {}, false);
        }
    } catch (error) {
        await logError(req, res, "FeesCollectionZoneWiseController", "updateFeesCollectionZoneWise", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deleteFeesCollectionZoneWise = async (req, res) => {
    const { id } = req.params;
    try {

        let data = await feesCollectionZoneWiseService.deleteFeesCollectionZoneWise(id)

        if (data) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DELETE_ERROR;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "FeesCollectionZoneWiseController", "deleteFeesCollectionZoneWise", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};


module.exports = {
    getFeesCollectionZoneWise,
    createFeesCollectionZoneWise,
    updateFeesCollectionZoneWise,
    deleteFeesCollectionZoneWise,
};
