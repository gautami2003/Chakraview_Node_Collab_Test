const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const dropRouteMasterService = require('../services/dropRouteMaster.service');
// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");


const getAllDropRoute = async (req, res) => {
    const busOperatorId = req.user.busOperatorID;
    try {
        const getDropRoute = await dropRouteMasterService.getAllDropRoute(busOperatorId);

        const result = getDropRoute.map((data) => ({
            dropRouteID: data.DropRouteID,
            schoolName: data?.school_master?.SchoolName,
            routeName: data.RouteName,
            busName: data.BusName,
            driverName: data?.bus_incharge_master?.DriverName,
            startLocation: data.StartLocation,
            destinationLocation: data.DestinationLocation,
            startTimeHour: data.StartTimeHour,
            startTimeMinute: data.StartTimeMinute,
            startTimeAMPM: data.StartTimeAMPM,
            endTimeHour: data.EndTimeHour,
            endTimeMinute: data.EndTimeMinute,
            endTimeAMPM: data.EndTimeAMPM,
            idealKMS: data.IdealKMS,
        }));

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    } catch (error) {
        await logError(req, res, "dropRouteMaster", "getAllDropRoute", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const createDropRoute = async (req, res) => {
    const { body } = req;
    const busOperatorId = req.user.busOperatorID;
    try {
        const data = await dropRouteMasterService.createDropRoute(busOperatorId, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.ROUTE_NAME_EXISTS, {}, {}, false);
        }
    } catch (error) {
        await logError(req, res, "dropRouteMaster", "createDropRoute", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateDropRoute = async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    const busOperatorId = req.user.busOperatorID;
    try {
        const data = await dropRouteMasterService.updateDropRoute(busOperatorId, id, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.ROUTE_NAME_EXISTS);
        }

    } catch (error) {
        await logError(req, res, "dropRouteMaster", "updateDropRoute", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deleteDropRoute = async (req, res) => {
    const { id } = req.params;
    try {

        let data = await dropRouteMasterService.deleteDropRoute(id)

        if (data) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DELETE_ERROR;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "dropRouteMaster", "deleteDropRoute", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};


module.exports = {
    getAllDropRoute,
    createDropRoute,
    updateDropRoute,
    deleteDropRoute,
};
