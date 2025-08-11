const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const schoolService = require('../services/schoolMaster.service');
// Constants.
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const redisService = require("../services/redis.service");
const { logError } = require("../utils/logger");


const getAllSchool = async (req, res) => {
    const { busOperatorId } = req.query;
    // const busOperatorId = req.user.busOperatorID;
    try {
        const getSchool = await schoolService.getAllSchool(busOperatorId);

        const result = getSchool.map((data) => ({
            schoolID: data.SchoolID,
            schoolName: data.SchoolName,
            cuntryName: data.country_master.CountryName,
            address1: data.Address1,
            address2: data.Address2,
            cityName: data.city_master.CityName,
            pincode: data.Pincode,
            prePrimarySectionInchargeName: data.PrePrimarySectionInchargeName,
            prePrimarySectionInchargeNumber: data.PrePrimarySectionInchargeNumber,
            primarySectionInchargeName: data.PrimarySectionInchargeName,
            primarySectionInchargeNumber: data.PrimarySectionInchargeNumber,
            secondarySectionInchargeName: data.SecondarySectionInchargeName,
            secondarySectionInchargeNumber: data.SecondarySectionInchargeNumber,
            latitude: data.Latitude,
            longitude: data.Longitude
        }));

        // return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, getBus);
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    } catch (error) {
        await logError(req, res, "schoolMaster", "getAllSchool", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getSchoolNameList = async (req, res) => {
    const { busOperatorId } = req.query;
    try {
        const redisKey = `admin_school_list`;
        const getSchoolName = await redisService.getRedisValue(redisKey);
        if (getSchoolName) {
            return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, JSON.parse(getSchoolName));
        }
        const getSchoolList = await schoolService.getSchoolName(busOperatorId);

        const result = getSchoolList.map((data) => {
            return {
                schoolID: data.SchoolID,
                schoolName: data.SchoolName

            }
        })

        await redisService.setRedisValue(redisKey, JSON.stringify(result), 3600);
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);

    } catch (error) {
        await logError(req, res, "schoolMaster", "getSchoolNameList", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getSchoolHolidays = async (req, res) => {
    const busOperatorId = req.user.busOperatorID;
    try {
        const getSchoolHolidays = await schoolService.getSchoolHolidays(busOperatorId);

        const result = getSchoolHolidays.map((data) => {
            return {
                schoolHolidaysID: data.SchoolHolidaysID,
                schoolName: data?.school_master?.SchoolName,
                type: data.Type,
                startDate: data.StartDate,
                endDate: data.EndDate,
                event: data.Event,
                standard: data.Standard,

            }
        })

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);

    } catch (error) {
        await logError(req, res, "schoolMaster", "getSchoolHolidays", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const schoolFeesDiscounts = async (req, res) => {
    const { schoolID, routeType } = req.query;
    try {
        const feesDiscounts = await schoolService.schoolFeesDiscounts(schoolID, routeType);

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, feesDiscounts);

    } catch (error) {
        await logError(req, res, "schoolMaster", "getSchoolHolidays", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};


const createSchool = async (req, res) => {
    const { body } = req;
    const busOperatorId = req.user.busOperatorID;
    try {
        const data = await schoolService.createSchool(busOperatorId, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.CREATE_ERROR);
        }

    } catch (error) {
        await logError(req, res, "schoolMaster", "createSchool", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateSchool = async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    try {
        const data = await schoolService.updateSchool(id, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.CREATE_ERROR);
        }

    } catch (error) {
        await logError(req, res, "schoolMaster", "updateSchool", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deleteSchool = async (req, res) => {
    const { id } = req.params;
    try {

        let data = await schoolService.deleteSchool(id)

        if (data) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DELETE_ERROR;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "schoolMaster", "deleteSchool", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};


module.exports = {
    getAllSchool,
    getSchoolNameList,
    getSchoolHolidays,
    schoolFeesDiscounts,
    createSchool,
    updateSchool,
    deleteSchool,
};
