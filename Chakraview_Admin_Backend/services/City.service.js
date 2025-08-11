// const RedisClient = require('../configs/redis.config');
const { date } = require('joi');
const moment = require("moment");
const { DB_MODELS } = require('../constants/models.constant');
const dbService = require('./db.service');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const getCity = async (id) => {

    try {
        return await DB_MODELS.CITY_MASTER.findAll({
            attributes: ["CityID", "CityName"],
            where: { CountryID: id },
            order: [["CityName"]],
            logging: console.log
        });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getCity,
};