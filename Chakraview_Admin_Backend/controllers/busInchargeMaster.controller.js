const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const busInchargeService = require('../services/busInchargeMaster.service');
// Constants.
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");


const getAllBusIncharge = async (req, res) => {
    const busOperatorId = req.user.busOperatorID;
    try {
        const getBusIncharge = await busInchargeService.getAllBusIncharge(busOperatorId);

        const result = getBusIncharge.map((data) => ({
            driverID: data.DriverID,
            driverName: data.DriverName,
            mobileNumber: data.MobileNumber,
            secondaryMobileNumber: data.SecondaryMobileNumber,
            attendantTypeName: data.attendant_type_master.AttendantTypeName,
            drivingLicenseNumber: data.DrivingLicenseNumber,
            drivingLicenseImage: data.DrivingLicenseImage,
            isBan: data.isBan,
        }));

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    } catch (error) {
        await logError(req, res, "busInchargeMaster", "getAllBusIncharge", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getAttendantType = async (req, res) => {
    try {
        const result = await busInchargeService.getAttendantType();

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    } catch (error) {
        await logError(req, res, "busInchargeMaster", "getAttendantType", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const createBusIncharge = async (req, res) => {
    const { body } = req;
    const busOperatorId = req.user.busOperatorID;
    try {
        const data = await busInchargeService.createBusIncharge(busOperatorId, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.MOBILE_NUMBER_EXISTS, {}, {}, false);
        }
    } catch (error) {
        await logError(req, res, "busInchargeMaster", "createBusIncharge", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateBusIncharge = async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    const busOperatorId = req.user.busOperatorID;
    try {
        const data = await busInchargeService.updateBusIncharge(busOperatorId, id, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.MOBILE_NUMBER_EXISTS);
        }

    } catch (error) {
        await logError(req, res, "busInchargeMaster", "updateBusIncharge", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deleteBusIncharge = async (req, res) => {
    const { id } = req.params;
    try {

        let data = await busInchargeService.deleteBusIncharge(id)

        if (data) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DELETE_ERROR;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "busInchargeMaster", "deleteBusIncharge", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};


module.exports = {
    getAllBusIncharge,
    getAttendantType,
    createBusIncharge,
    updateBusIncharge,
    deleteBusIncharge,
};
