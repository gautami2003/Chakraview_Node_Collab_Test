// const RedisClient = require('../configs/redis.config');
const { date } = require('joi');
const moment = require("moment");
const { DB_MODELS } = require('../constants/models.constant');
const dbService = require('./db.service');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const getAllStoppageTiming = async (id, page, limit) => {

    const offset = (page - 1) * limit;
    try {
        const getStoppageTiming = await DB_MODELS.ROUTE_STOPPAGE_TIMING_MASTER.findAndCountAll({
            where: { BusOperatorID: id, isDeleted: 'N' },
            attributes: ["RouteStoppageTimingID", "Type", "RouteID", "StoppageTimeHour", "StoppageTimeMinute", "StoppageTimeAMPM", "StoppageTime"],
            include: [
                {
                    model: DB_MODELS.SCHOOL_MASTER,
                    attributes: ["SchoolName",],
                    where: { isDeleted: 'N' }
                },
                {
                    model: DB_MODELS.STOPPAGE_MASTER,
                    where: { isDeleted: 'N' },
                    attributes: ["StopageName",]
                }
            ],
            limit: limit,
            offset: offset,
        });

        const result = [];
        for (const data of getStoppageTiming.rows) {
            console.log(data, "getStoppageTiminggetStoppageTiminggetStoppageTiming");
            let selRouteName;
            let selPrimaryMobileNumber;
            if (data.Type === "Pickup") {
                selRouteName = await DB_MODELS.PICKUP_ROUTE_MASTER.findOne({
                    where: { PickupRouteID: data.RouteID, isDeleted: 'N' },
                    attributes: ["RouteName"]
                });
                selPrimaryMobileNumber = await DB_MODELS.STUDENT_MASTER.findOne({
                    attributes: ["PrimaryMobileNumber"],
                    where: { isBan: 'N', BusOperatorID: id, isDeleted: 'N', FromRouteID: data.RouteID },
                    logging: console.log
                });

            } else if (data.Type === "Drop") {
                selRouteName = await DB_MODELS.DROP_ROUTE_MASTER.findOne({
                    where: { DropRouteID: data.RouteID, isDeleted: 'N' },
                    attributes: ["RouteName"]
                });
                selPrimaryMobileNumber = await DB_MODELS.STUDENT_MASTER.findOne({
                    attributes: ["PrimaryMobileNumber"],
                    where: { isBan: 'N', BusOperatorID: id, isDeleted: 'N', FromRouteID: data.RouteID },
                    logging: console.log
                });
            }
            result.push({
                routeStoppageTimingID: data.RouteStoppageTimingID,
                schoolName: data?.school_master.SchoolName || "",
                type: data.Type,
                routeName: selRouteName.RouteName,
                primaryMobileNumber: selPrimaryMobileNumber?.PrimaryMobileNumber || "",
                stopageName: data?.stoppage_master.StopageName || "",
                stoppageTimeHour: data.StoppageTimeHour,
                stoppageTimeMinute: data.StoppageTimeMinute,
                stoppageTimeAMPM: data.StoppageTimeAMPM,
                stoppageTime: data.StoppageTime,
            })
        }
        return {
            count: getStoppageTiming.count,
            rows: result,
        };
        // return result;
    } catch (error) {
        throw error;
    }
};

const createStoppageTiming = async (busOperatorId, data) => {
    try {
        const selStoppageId = await DB_MODELS.ROUTE_STOPPAGE_TIMING_MASTER.count({
            where: { BusOperatorID: busOperatorId, SchoolID: data.schoolID, isDeleted: 'N', Type: data.type, RouteID: data.routeID, StoppageID: data.stoppageID },
            attributes: ["StoppageID"],
        });

        if (selStoppageId > 0) {
            return false
        } else {
            const StoppageTimingCreate = await DB_MODELS.ROUTE_STOPPAGE_TIMING_MASTER.create({
                BusOperatorID: busOperatorId,
                SchoolID: data.schoolID,
                Type: data.type,
                RouteID: data.routeID,
                StoppageID: data.stoppageID,
                StoppageTimeHour: data.stoppageTimeHour,
                StoppageTimeMinute: data.stoppageTimeMinute,
                StoppageTimeAMPM: data.stoppageTimeAMPM,
                StoppageTime: `${data.stoppageTimeHour}:${data.stoppageTimeMinute} ${data.stoppageTimeAMPM}`,
                isDeleted: "N",
                CreatedBy: "Admin",
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
            });
            if (StoppageTimingCreate) {
                return true;
            }
            return false;
        };

    } catch (error) {
        throw error;
    }
};

const updateStoppageTiming = async (busOperatorId, id, data) => {
    try {
        const selStoppageId = await DB_MODELS.ROUTE_STOPPAGE_TIMING_MASTER.count({
            where: { BusOperatorID: busOperatorId, SchoolID: data.schoolID, isDeleted: 'N', Type: data.type, RouteID: data.routeID, StoppageID: data.stoppageID, RouteStoppageTimingID: { [Op.ne]: id } },
            attributes: ["StoppageID"],
        });

        if (selStoppageId > 0) {
            return false
        } else {

            const StoppageTimingUpdate = await DB_MODELS.ROUTE_STOPPAGE_TIMING_MASTER.update({
                SchoolID: data.schoolID,
                Type: data.type,
                RouteID: data.routeID,
                StoppageID: data.stoppageID,
                StoppageTimeHour: data.stoppageTimeHour,
                StoppageTimeMinute: data.stoppageTimeMinute,
                StoppageTimeAMPM: data.stoppageTimeAMPM,
                StoppageTime: `${data.stoppageTimeHour}:${data.stoppageTimeMinute} ${data.stoppageTimeAMPM}`,
                UpdatedBy: "Admin",
                UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
            },
                { where: { RouteStoppageTimingID: id } }
            );
            if (StoppageTimingUpdate) {
                return true;
            };
            return false;
        };

    } catch (error) {
        throw error;
    }
};

const deleteStoppageTiming = async (id) => {
    try {
        return await DB_MODELS.ROUTE_STOPPAGE_TIMING_MASTER.update({
            isDeleted: 'Y',
        }, {
            where: { RouteStoppageTimingID: id }
        })
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllStoppageTiming,
    createStoppageTiming,
    updateStoppageTiming,
    deleteStoppageTiming,
};