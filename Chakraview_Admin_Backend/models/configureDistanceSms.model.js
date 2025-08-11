const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const ConfigureDistanceSmsModel = sequelize_connection.define('configure_distance_sms', {
    DistanceSMSConfigurationID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    RouteType: {
        type: DataTypes.STRING
    },
    SchoolSection: {
        type: DataTypes.STRING
    },
    StudentStandard: {
        type: DataTypes.STRING
    },
    CreatedOn: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'configure_distance_sms',
    timestamps: false
});

module.exports = ConfigureDistanceSmsModel;