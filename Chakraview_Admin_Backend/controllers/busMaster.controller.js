const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const busService = require('../services/busMaster.service');
// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");


const getAllBus = async (req, res) => {
    // const { busOperatorId } = req.query;
    const busOperatorId = req.user.busOperatorID
    // const busOperatorId = 51
    try {
        const getBus = await busService.getAllBus(busOperatorId)
        const result = getBus.map((data) => {
            return {
                busID: data.BusID,
                busName: data.BusName,
                busSeats: data.BusSeats,
                busRegistrationNumber: data.BusRegistrationNumber,
                busChasisNumber: data.BusChasisNumber,
                busRegistrationDate: data.BusRegistrationDate,
                gPSDeviceIMEINo: data.GPSDeviceIMEINo,
                gPSDeviceMobileNumber: data.GPSDeviceMobileNumber
            }
        })
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    } catch (error) {
        await logError(req, res, "busController", "getAllBus", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const createBus = async (req, res) => {
    const { body } = req;
    const busOperatorID = req.user.busOperatorID

    try {
        let data = await busService.createBus(body, busOperatorID)

        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.BUSNAME_REGISTRATION_EXISTS, {}, {}, false);
        }
    } catch (error) {
        await logError(req, res, "busMasterController", "createBus", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateBus = async (req, res) => {
    const { body } = req;
    const { id } = req.params;

    try {
        let data = await busService.updateBus(id, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.BUSNAME_REGISTRATION_EXISTS, {}, {}, false);
        }
    } catch (error) {
        await logError(req, res, "busMasterController", "updateBus", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deleteBus = async (req, res) => {
    const { id } = req.params;
    try {

        let data = await busService.deleteBus(id)

        if (data) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DELETE_ERROR;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "busMasterController", "deleteBus", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};


module.exports = {
    getAllBus,
    createBus,
    updateBus,
    deleteBus,
};
