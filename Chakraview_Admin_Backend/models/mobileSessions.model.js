const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const MobileSessionsModel = sequelize_connection.define('Mobile_Sessions', {
    msid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    imei: {
        type: DataTypes.STRING
    },
    ostype: {
        type: DataTypes.STRING
    },
    osversion: {
        type: DataTypes.STRING
    },
    model: {
        type: DataTypes.STRING
    },
    brand: {
        type: DataTypes.STRING
    },
    pushtoken: {
        type: DataTypes.INTEGER
    },
    DateTime: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.INTEGER
    },
    ValidUpto: {
        type: DataTypes.STRING
    },
    sessionid: {
        type: DataTypes.INTEGER
    },
    lastactivity: {
        type: DataTypes.STRING
    },
    loginnumber: {
        type: DataTypes.STRING
    }

}, {
    tableName: 'Mobile_Sessions',
    timestamps: false
});

module.exports = MobileSessionsModel;