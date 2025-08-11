const apiHelper = require("../helpers/api.helper");
const { COMMON_MESSAGES } = require("../constants/messages.constant");
const configureDistanceSmsService = require('../services/configureDistanceSms.service');


const getSchoolsAndStandard = async (req, res) => {
    try {
        const busOperatorId = req.user.busOperatorID;

        const result = await configureDistanceSmsService.getSchoolsAndStandardByBusOperatorID(busOperatorId);
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    }
    catch (error) {
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const GetSchoolAndStd = async (req, res) => {
    try {
        const busOperatorId = req.user.busOperatorID;
        const result = await configureDistanceSmsService.getSchoolsAndStandard(busOperatorId);
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    }
    catch (error) {
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateSchoolandStandard = async (req, res) => {
    try {
        const data = req.body;
        const result = await configureDistanceSmsService.updateSchoolandStandard(req.params.id, data);
        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED, {});
    }
    catch (error) {
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

module.exports = {
    getSchoolsAndStandard,
    GetSchoolAndStd,
    updateSchoolandStandard

};