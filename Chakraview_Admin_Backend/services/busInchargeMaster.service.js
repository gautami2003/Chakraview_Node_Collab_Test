// const RedisClient = require('../configs/redis.config');
const { date } = require('joi');
const moment = require("moment");
const { DB_MODELS } = require('../constants/models.constant');
const dbService = require('./db.service');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const getAllBusIncharge = async (id) => {
    try {
        return await DB_MODELS.BUS_INCHARGE_MASTER.findAll({
            where: { BusOperatorID: id, isDeleted: 'N' },
            attributes: ["DriverID", "DriverName", "MobileNumber", "SecondaryMobileNumber", "DrivingLicenseNumber", "DrivingLicenseImage", "isBan"],
            include: [
                {
                    model: DB_MODELS.ATTENDANT_TYPE_MASTER,
                    attributes: ["AttendantTypeName",]
                },
            ],
        });
    } catch (error) {
        throw error;
    }
};

const getAttendantType = async (id) => {
    try {
        return await DB_MODELS.ATTENDANT_TYPE_MASTER.findAll({
            attributes: ["AttendantTypeID", "AttendantTypeName"],
        });
    } catch (error) {
        throw error;
    }
};

const createBusIncharge = async (id, data) => {
    try {

        const selMobileNumber = await DB_MODELS.BUS_INCHARGE_MASTER.count({
            where: { MobileNumber: data.mobileNumber }
        });

        if (selMobileNumber > 0) {
            return false
        } else {

            const busInchargeCreate = await DB_MODELS.BUS_INCHARGE_MASTER.create({
                BusOperatorID: id,
                DriverName: data.driverName,
                MobileNumber: data.mobileNumber,
                SecondaryMobileNumber: data.secondaryMobileNumber,
                AttendantTypeID: data.attendantTypeID,
                DrivingLicenseNumber: data.drivingLicenseNumber,
                DrivingLicenseImage: data.drivingLicenseImage ? data.drivingLicenseImage : "uploads/busIncharge/default-thumb.jpg",
                isBan: "N",
                isDeleted: "N",
                CreatedBy: "Admin",
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
            });
            if (busInchargeCreate) {
                return true;
            }
            return false;
        };

    } catch (error) {
        throw error;
    }
};

const updateBusIncharge = async (busOperatorId, id, data) => {
    try {

        const selMobileNumber = await DB_MODELS.BUS_INCHARGE_MASTER.count({
            where: { BusOperatorID: busOperatorId, MobileNumber: data.mobileNumber, DriverID: { [Op.ne]: id }, isDeleted: 'N', }
        });

        if (selMobileNumber > 0) {
            return false
        } else {
            const updateData = {
                DriverName: data.driverName,
                MobileNumber: data.mobileNumber,
                SecondaryMobileNumber: data.secondaryMobileNumber,
                AttendantTypeID: data.attendantTypeID,
                DrivingLicenseNumber: data.drivingLicenseNumber,
                UpdatedBy: "Admin",
                UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
            }
            if (data.drivingLicenseImage != "") {
                updateData.DrivingLicenseImage = data.drivingLicenseImage
            };
            const busInchargeCreate = await DB_MODELS.BUS_INCHARGE_MASTER.update(updateData,
                { where: { DriverID: id } }
            );
            if (busInchargeCreate) {
                return true;
            };
            return false;
        };

    } catch (error) {
        throw error;
    }
};

const deleteBusIncharge = async (id) => {
    try {
        return await DB_MODELS.BUS_INCHARGE_MASTER.update({
            isDeleted: 'Y',
        }, {
            where: { DriverID: id }
        })

    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllBusIncharge,
    getAttendantType,
    createBusIncharge,
    updateBusIncharge,
    deleteBusIncharge,
};