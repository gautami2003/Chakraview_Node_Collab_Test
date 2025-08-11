const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const feesMasterStudentwiseService = require('../services/feesMasterStudentwise.service');
// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");


const getFeesMasterStudentwise = async (req, res) => {
    const busOperatorId = req.user.busOperatorID;
    try {
        const getFeesMasterStudentwise = await feesMasterStudentwiseService.getFeesMasterStudentwise(busOperatorId)

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, getFeesMasterStudentwise);
    } catch (error) {
        await logError(req, res, "FeesMasterStudentwiseController", "getFeesMasterStudentwise", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const createFeesMasterStudentwise = async (req, res) => {
    const { body } = req;
    const busOperatorID = req.user.busOperatorID

    try {
        let data = await feesMasterStudentwiseService.createFeesMasterStudentwise(body, busOperatorID)

        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.DUPLICATE_RESOURCE, {}, {}, false);
        }
    } catch (error) {
        await logError(req, res, "FeesMasterStudentwiseController", "createFeesMasterStudentwise", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateFeesMasterStudentwise = async (req, res) => {
    const { body } = req;
    const { id } = req.params;

    try {
        let data = await feesMasterStudentwiseService.updateFeesMasterStudentwise(id, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.DUPLICATE_RESOURCE, {}, {}, false);
        }
    } catch (error) {
        await logError(req, res, "FeesMasterStudentwiseController", "updateFeesMasterStudentwise", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deleteFeesMasterStudentwise = async (req, res) => {
    const { id } = req.params;
    try {

        let data = await feesMasterStudentwiseService.deleteFeesMasterStudentwise(id)

        if (data) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DELETE_ERROR;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "FeesMasterStudentwiseController", "deleteFeesMasterStudentwise", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};


module.exports = {
    getFeesMasterStudentwise,
    createFeesMasterStudentwise,
    updateFeesMasterStudentwise,
    deleteFeesMasterStudentwise,
};
