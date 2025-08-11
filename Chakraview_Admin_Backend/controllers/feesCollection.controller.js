const apiHelper = require("../helpers/api.helper");
const { COMMON_MESSAGES } = require("../constants/messages.constant");
const feesCollectionService = require('../services/feesCollection.service');
const { logError } = require("../utils/logger");
const paginationConstant = require("../constants/pagination.constant");

const getAllFeesWithDetails = async (req, res) => {
    try {
        const busOperatorId = req.user.busOperatorID;
        const { page, modeOfPayment } = req.query;
        const totalPage = parseInt(page) || 1;
        const totalLimit = parseInt(paginationConstant.LIMIT);
        const result = await feesCollectionService.getAllFees(modeOfPayment, busOperatorId, totalPage, totalLimit);
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { count: result.count, totalLimit: totalLimit, result: result.rows });
    }
    catch (error) {
        await logError(req, res, "feesCollectionController", "getAllFeesWithDetails", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const createFeesCollection = async (req, res) => {
    try {
        const { body } = req;
        await feesCollectionService.createFeesCollection(body);
        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED, {});
    }
    catch (error) {
        await logError(req, res, "feesCollectionController", "createFeesCollection", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deleteFeesCollection = async (req, res) => {
    try {
        await feesCollectionService.deleteFeesCollection(req.params.id)
        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_DELETED, {});
    }
    catch (error) {
        await logError(req, res, "feesCollectionController", "deleteFeesCollection", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    };
}

const updateFeesCollection = async (req, res) => {
    try {
        const { body } = req;
        await feesCollectionService.updateFeesCollection(req.params.id, body);
        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED, {});
    }
    catch (error) {
        await logError(req, res, "feesCollectionController", "updateFeesCollection", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
}

module.exports = {
    getAllFeesWithDetails,
    createFeesCollection,
    deleteFeesCollection,
    updateFeesCollection
}
