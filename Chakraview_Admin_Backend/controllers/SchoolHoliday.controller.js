const apiHelper = require("../helpers/api.helper");
const { COMMON_MESSAGES } = require("../constants/messages.constant");
const schoolHolidayService = require('../services/schoolHoliday.service');
const { DB_MODELS } = require("../constants/models.constant");

const createSchoolHoliday = async (req, res) => {
    try {
        const data = req.body;

        const result = await schoolHolidayService.createHoliday(data);
        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED, {});
    }
    catch (error) {
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getAllSchoolHoliday = async (req, res) => {
    try {
        const result = await schoolHolidayService.getSchoolHolidays(req.params.id);
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, {});
    }
    catch (error) {
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getSingleSchoolHoliday = async (req, res) => {
    try {
        const result = await schoolHolidayService.getSingleHoliday(req.params.id)
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, {});
    }
    catch (error) {
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deleteSchoolHoliday = async (req, res) => {
    try {
        const result = await schoolHolidayService.deleteHoliday(req.params.id)
        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_DELETED, {});
    }
    catch (error) {
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateSchoolHoliday = async (req, res) => {
    try {
        const data = req.body;
        const result = await schoolHolidayService.updateHoliday(req.params.id, data)
        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED, {});
    }
    catch (error) {
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
}

module.exports = {
    createSchoolHoliday,
    getAllSchoolHoliday,
    getSingleSchoolHoliday,
    deleteSchoolHoliday,
    updateSchoolHoliday
};


