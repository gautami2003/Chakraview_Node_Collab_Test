// const RedisClient = require('../configs/redis.config');
const { date } = require('joi');
const moment = require("moment");
const { DB_MODELS } = require('../constants/models.constant');
const dbService = require('./db.service');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const getCountry = async () => {

    try {
        return await DB_MODELS.COUNTRY_MASTER.findAll({
            order: [["CountryName"]],
        });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getCountry,
};