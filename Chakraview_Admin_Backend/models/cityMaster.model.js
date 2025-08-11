const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const BusOperatorMasterModel = require('./busOperatorMaster.model');
// const { DB_MODELS } = require("../constants/models.constant");
const CityMasterModel = sequelize_connection.define('city_master', {
    CityID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    CountryID: {
        type: DataTypes.INTEGER
    },
    CityName: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'city_master',
    timestamps: false
});
CityMasterModel.hasMany(BusOperatorMasterModel, { foreignKey: 'CityID' });
module.exports = CityMasterModel;