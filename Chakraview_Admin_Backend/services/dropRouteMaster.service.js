// const RedisClient = require('../configs/redis.config');
const { date } = require('joi');
const moment = require("moment");
const { DB_MODELS } = require('../constants/models.constant');
const dbService = require('./db.service');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const getAllDropRoute = async (id) => {
    try {
        return await DB_MODELS.DROP_ROUTE_MASTER.findAll({
            where: { BusOperatorID: id, isDeleted: 'N' },
            attributes: ["DropRouteID", "RouteName", "BusName", "StartLocation", "DestinationLocation",
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

const createDropRoute = async (id, data) => {
    try {
        const selRouteName = await DB_MODELS.DROP_ROUTE_MASTER.count({
            where: { BusOperatorID: id, SchoolID: data.schoolID, RouteName: data.routeName, isDeleted: 'N' }
        });

        if (selRouteName > 0) {
            return false
        } else {
            const startTimeDrop = `${data.startTimeHour}:${data.startTimeMinute} ${data.startTimeAMPM}`;
            const endTimeDrop = `${data.endTimeHour}:${data.endTimeMinute} ${data.endTimeAMPM}`;

            const dropRouteCreate = await DB_MODELS.DROP_ROUTE_MASTER.create({
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
                StartTime_Drop: startTimeDrop,
                EndTimeHour: data.endTimeHour,
                EndTimeMinute: data.endTimeMinute,
                EndTimeAMPM: data.endTimeAMPM,
                EndTime_Drop: endTimeDrop,
                IdealKMS: data.idealKMS,
                isDeleted: "N",
                CreatedBy: "Admin",
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
            });
            if (dropRouteCreate) {
                return true;
            }
            return false;
        };

    } catch (error) {
        throw error;
    }
};

const updateDropRoute = async (busOperatorId, id, data) => {
    try {
        const selRouteName = await DB_MODELS.DROP_ROUTE_MASTER.count({
            where: { BusOperatorID: busOperatorId, SchoolID: data.schoolID, RouteName: data.routeName, DropRouteID: { [Op.ne]: id }, isDeleted: 'N' }
        });

        if (selRouteName > 0) {
            return false
        } else {
            const startTimeDrop = `${data.startTimeHour}:${data.startTimeMinute} ${data.startTimeAMPM}`;
            const endTimeDrop = `${data.endTimeHour}:${data.endTimeMinute} ${data.endTimeAMPM}`;

            const DropRouteUpdate = await DB_MODELS.DROP_ROUTE_MASTER.update({
                SchoolID: data.schoolID,
                RouteName: data.routeName,
                BusName: data.busName,
                DriverID: data.driverID,
                StartLocation: data.startLocation,
                DestinationLocation: data.destinationLocation,
                StartTimeHour: data.startTimeHour,
                StartTimeMinute: data.startTimeMinute,
                StartTimeAMPM: data.startTimeAMPM,
                StartTime_Drop: startTimeDrop,
                EndTimeHour: data.endTimeHour,
                EndTimeMinute: data.endTimeMinute,
                EndTimeAMPM: data.endTimeAMPM,
                EndTime_Drop: endTimeDrop,
                IdealKMS: data.idealKMS,
                UpdatedBy: "Admin",
                UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
            },
                { where: { DropRouteID: id } }
            );
            if (DropRouteUpdate) {
                return true;
            };
            return false;
        };

    } catch (error) {
        throw error;
    }
};

const deleteDropRoute = async (id) => {
    try {
        const deleteDropRoute = await DB_MODELS.DROP_ROUTE_MASTER.update(
            { isDeleted: 'Y', },
            { where: { DropRouteID: id } }
        );

        if (deleteDropRoute) {
            await DB_MODELS.STUDENT_MASTER.update(
                { ToRouteID: 0 },
                { where: { ToRouteID: id } }
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
    getAllDropRoute,
    createDropRoute,
    updateDropRoute,
    deleteDropRoute,
};