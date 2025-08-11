// const RedisClient = require('../configs/redis.config');
const { date } = require('joi');
const moment = require("moment");
const { DB_MODELS } = require('../constants/models.constant');
const dbService = require('./db.service');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const getAllBusStoppage = async (id, page, limit) => {

    const offset = (page - 1) * limit;
    try {
        return await DB_MODELS.STOPPAGE_MASTER.findAndCountAll({
            where: { BusOperatorID: id, isDeleted: 'N' },
            attributes: ["StoppageID", "StopageName", "Location", "Address1", "Address2", "Pincode", "Latitude", "Longitude"],
            include: [
                {
                    model: DB_MODELS.COUNTRY_MASTER,
                    attributes: ["CountryName",]
                },
                {
                    model: DB_MODELS.CITY_MASTER,
                    attributes: ["CityName",]
                }
            ],
            limit: limit,
            offset: offset,
        });
    } catch (error) {
        throw error;
    }
};

const createBusStoppage = async (id, data) => {
    try {
        const selStopageName = await DB_MODELS.STOPPAGE_MASTER.count({
            where: { BusOperatorID: id, StopageName: data.stopageName, isDeleted: 'N' }
        });

        if (selStopageName > 0) {
            return false
        } else {
            const getSchoolId = await DB_MODELS.SCHOOL_MASTER.findOne({
                attributes: ["SchoolID"],
                where: { BusOperatorID: id, isDeleted: 'N' }
            })
            const busStoppageCreate = await DB_MODELS.STOPPAGE_MASTER.create({
                BusOperatorID: id,
                SchoolID: getSchoolId.schoolID,
                StopageName: data.stopageName,
                Location: data.location,
                CountryID: data.countryID,
                Address1: data.address1,
                Address2: data.address2,
                CityID: data.cityID,
                Pincode: data.pincode,
                Latitude: data.latitude,
                Longitude: data.longitude,
                isDeleted: "N",
                CreatedBy: "Admin",
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
            });
            if (busStoppageCreate) {
                return true;
            }
            return false;
        };

    } catch (error) {
        throw error;
    }
};

const updateBusStoppage = async (busOperatorId, id, data) => {
    try {
        const selStopageName = await DB_MODELS.STOPPAGE_MASTER.count({
            where: { BusOperatorID: busOperatorId, StopageName: data.stopageName, StoppageID: { [Op.ne]: id }, isDeleted: 'N' }
        });

        if (selStopageName > 0) {
            return false
        } else {

            const busStoppageUpdate = await DB_MODELS.STOPPAGE_MASTER.update({
                StopageName: data.stopageName,
                Location: data.location,
                CountryID: data.countryID,
                Address1: data.address1,
                Address2: data.address2,
                CityID: data.cityID,
                Pincode: data.pincode,
                Latitude: data.latitude,
                Longitude: data.longitude,
                UpdatedBy: "Admin",
                UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
            },
                { where: { StoppageID: id } }
            );
            if (busStoppageUpdate) {
                return true;
            };
            return false;
        };

    } catch (error) {
        throw error;
    }
};

const deleteBusStoppage = async (id) => {
    try {
        const deleteBusStoppage = await DB_MODELS.STOPPAGE_MASTER.update(
            { isDeleted: 'Y', },
            { where: { StoppageID: id } }
        );

        if (deleteBusStoppage) {
            await DB_MODELS.STUDENT_MASTER.update(
                { FromStoppageID: 0 },
                { where: { FromStoppageID: id } }
            )
            await DB_MODELS.STUDENT_MASTER.update(
                { ToStoppageID: 0 },
                { where: { ToStoppageID: id } }
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
    getAllBusStoppage,
    createBusStoppage,
    updateBusStoppage,
    deleteBusStoppage,
};