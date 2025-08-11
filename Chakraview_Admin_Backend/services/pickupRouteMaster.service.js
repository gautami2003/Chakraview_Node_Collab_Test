// const RedisClient = require('../configs/redis.config');
const { date } = require('joi');
const moment = require("moment");
const { DB_MODELS } = require('../constants/models.constant');
const dbService = require('./db.service');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const getAllPickupRoute = async (id) => {
    try {
        return await DB_MODELS.PICKUP_ROUTE_MASTER.findAll({
            where: { BusOperatorID: id, isDeleted: 'N' },
            attributes: ["PickupRouteID", "RouteName", "BusName", "StartLocation", "DestinationLocation",
                "StartTimeHour", "StartTimeMinute", "StartTimeAMPM", "EndTimeHour", "EndTimeMinute", "EndTimeAMPM", "IdealKMS"],
            include: [
                {
                    model: DB_MODELS.SCHOOL_MASTER,
                    attributes: ["SchoolName",]
                },
                {
                    model: DB_MODELS.BUS_INCHARGE_MASTER,
                    attributes: ["DriverName",]
                }
            ],
            order: [['RouteName']]
        });
    } catch (error) {
        throw error;
    }
};

const createPickupRoute = async (id, data) => {
    try {

        const selRouteName = await DB_MODELS.PICKUP_ROUTE_MASTER.count({
            where: { BusOperatorID: id, SchoolID: data.schoolID, RouteName: data.routeName, isDeleted: 'N' }
        });

        if (selRouteName > 0) {
            return false
        } else {
            const startTimePickUp = `${data.startTimeHour}:${data.startTimeMinute} ${data.startTimeAMPM}`;
            const endTimePickUp = `${data.endTimeHour}:${data.endTimeMinute} ${data.endTimeAMPM}`;

            const pickupRouteCreate = await DB_MODELS.PICKUP_ROUTE_MASTER.create({
                BusOperatorID: id,
                SchoolID: data.schoolID,
                RouteName: data.routeName,
                BusName: data.busName,
                DriverID: data.driverID,
                StartLocation: data.startLocation,
                DestinationLocation: data.destinationLocation,
                StartTimeHour: data.startTimeHour,
                StartTimeMinute: data.startTimeMinute,
                StartTimeAMPM: data.startTimeAMPM,
                StartTime_PickUp: startTimePickUp,
                EndTimeHour: data.endTimeHour,
                EndTimeMinute: data.endTimeMinute,
                EndTimeAMPM: data.endTimeAMPM,
                EndTime_PickUp: endTimePickUp,
                IdealKMS: data.idealKMS,
                isDeleted: "N",
                CreatedBy: "Admin",
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
            });
            if (pickupRouteCreate) {
                return true;
            }
            return false;
        };

    } catch (error) {
        throw error;
    }
};

const updatePickupRoute = async (busOperatorId, id, data) => {
    try {
        const selRouteName = await DB_MODELS.PICKUP_ROUTE_MASTER.count({
            where: { BusOperatorID: busOperatorId, SchoolID: data.schoolID, RouteName: data.routeName, PickupRouteID: { [Op.ne]: id }, isDeleted: 'N' }
        });

        if (selRouteName > 0) {
            return false
        } else {
            const startTimePickUp = `${data.startTimeHour}:${data.startTimeMinute} ${data.startTimeAMPM}`;
            const endTimePickUp = `${data.endTimeHour}:${data.endTimeMinute} ${data.endTimeAMPM}`;

            const PickupRouteUpdate = await DB_MODELS.PICKUP_ROUTE_MASTER.update({
                SchoolID: data.schoolID,
                RouteName: data.routeName,
                BusName: data.busName,
                DriverID: data.driverID,
                StartLocation: data.startLocation,
                DestinationLocation: data.destinationLocation,
                StartTimeHour: data.startTimeHour,
                StartTimeMinute: data.startTimeMinute,
                StartTimeAMPM: data.startTimeAMPM,
                StartTime_PickUp: startTimePickUp,
                EndTimeHour: data.endTimeHour,
                EndTimeMinute: data.endTimeMinute,
                EndTimeAMPM: data.endTimeAMPM,
                EndTime_PickUp: endTimePickUp,
                IdealKMS: data.idealKMS,
                UpdatedBy: "Admin",
                UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
            },
                { where: { PickupRouteID: id } }
            );
            if (PickupRouteUpdate) {
                return true;
            };
            return false;
        };

    } catch (error) {
        throw error;
    }
};

const deletePickupRoute = async (id) => {
    try {
        const deletePickupRoute = await DB_MODELS.PICKUP_ROUTE_MASTER.update(
            { isDeleted: 'Y', },
            { where: { PickupRouteID: id } }
        );

        if (deletePickupRoute) {
            await DB_MODELS.STUDENT_MASTER.update(
                { FromRouteID: 0 },
                { where: { FromRouteID: id } }
            )
            return true
        } else {
            return false
        }

    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllPickupRoute,
    createPickupRoute,
    updatePickupRoute,
    deletePickupRoute,
};