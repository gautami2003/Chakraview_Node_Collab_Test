// const RedisClient = require('../configs/redis.config');
const { DB_MODELS } = require('../constants/models.constant');
const moment = require("moment");
const dbService = require('./db.service');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const getAllBus = async (busOperatorId) => {
    try {
        return await DB_MODELS.BUS_MASTER.findAll({
            where: { BusOperatorID: busOperatorId, isDeleted: 'N' },
            attributes: ["BusID", "BusName", "BusSeats", "BusRegistrationNumber", "BusChasisNumber", "BusRegistrationDate", "GPSDeviceIMEINo", "GPSDeviceMobileNumber"]
        })
    } catch (error) {
        throw error;
    }
};

const createBus = async (data, busOperatorID) => {
    try {

        let busNameAndRegistrationNo = await DB_MODELS.BUS_MASTER.count({
            where: {
                [Op.or]: [
                    { BusName: data.busName },
                    { BusRegistrationNumber: data.busRegistrationNumber },
                ],
                isDeleted: 'N'
            }
        });

        if (busNameAndRegistrationNo > 0) {
            return false
        }
        else {
            const createBus = await DB_MODELS.BUS_MASTER.create({
                BusOperatorID: busOperatorID,
                BusName: data.busName,
                BusSeats: data.busSeats,
                BusRegistrationNumber: data.busRegistrationNumber,
                BusChasisNumber: data.busChasisNumber,
                BusRegistrationDate: data.busRegistrationDate,
                GPSDeviceIMEINo: data.gPSDeviceIMEINo,
                GPSDeviceMobileNumber: data.gPSDeviceMobileNumber,
                isDeleted: "N",
                CreatedBy: "Admin",
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
            })
            if (createBus) {
                return true
            }
            return false
        }

    } catch (error) {
        throw error;
    }
};

const updateBus = async (id, data) => {
    try {

        let busNameAndRegistrationNo = await DB_MODELS.BUS_MASTER.count({
            where: {
                [Op.or]: [
                    { BusName: data.busName },
                    { BusRegistrationNumber: data.busRegistrationNumber },
                ],
                isDeleted: 'N'
            }
        });

        if (busNameAndRegistrationNo > 0) {
            return false
        }
        else {
            const updateBus = await DB_MODELS.BUS_MASTER.update({
                BusName: data.busName,
                BusSeats: data.busSeats,
                BusRegistrationNumber: data.busRegistrationNumber,
                BusChasisNumber: data.busChasisNumber,
                BusRegistrationDate: data.busRegistrationDate,
                GPSDeviceIMEINo: data.gPSDeviceIMEINo,
                GPSDeviceMobileNumber: data.gPSDeviceMobileNumber,
                CreatedBy: "Admin",
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
            },
                { where: { BusID: id } }
            )
            if (updateBus) {
                return true
            }
            return false
        };
    } catch (error) {
        throw error;
    }
};

const deleteBus = async (id) => {
    try {
        return await DB_MODELS.BUS_MASTER.update({
            isDeleted: 'Y',
        }, {
            where: { BusID: id }
        })
    } catch (error) {
        throw error;
    }
};



module.exports = {
    getAllBus,
    createBus,
    updateBus,
    deleteBus,
};