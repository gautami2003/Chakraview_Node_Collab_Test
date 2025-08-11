const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const pickupRouteService = require('../services/pickupRouteMaster.service');
// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");


const getAllPickupRoute = async (req, res) => {
    const busOperatorId = req.user.busOperatorID;
    try {
        const getPickupRoute = await pickupRouteService.getAllPickupRoute(busOperatorId);

        const result = getPickupRoute.map((data) => ({
            pickupRouteID: data.PickupRouteID,
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
        await logError(req, res, "pickupRouteMaster", "getAllPickupRoute", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const createPickupRoute = async (req, res) => {
    const { body } = req;
    const busOperatorId = req.user.busOperatorID;
    try {
        const data = await pickupRouteService.createPickupRoute(busOperatorId, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.ROUTE_NAME_EXISTS, {}, {}, false);
        }
    } catch (error) {
        await logError(req, res, "pickupRouteMaster", "createPickupRoute", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updatePickupRoute = async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    const busOperatorId = req.user.busOperatorID;
    try {
        const data = await pickupRouteService.updatePickupRoute(busOperatorId, id, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.ROUTE_NAME_EXISTS);
        }

    } catch (error) {
        await logError(req, res, "pickupRouteMaster", "updatePickupRoute", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deletePickupRoute = async (req, res) => {
    const { id } = req.params;
    try {

        let data = await pickupRouteService.deletePickupRoute(id)

        if (data) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DELETE_ERROR;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "pickupRouteMaster", "deletePickupRoute", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};


module.exports = {
    getAllPickupRoute,
    createPickupRoute,
    updatePickupRoute,
    deletePickupRoute,
};
