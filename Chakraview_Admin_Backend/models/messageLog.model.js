const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const MessageLogModel = sequelize_connection.define('message_log', {
    MessageLogID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    DriverRouteTransactionID: {
        type: DataTypes.INTEGER
    },
    BusID: {
        type: DataTypes.INTEGER
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    RouteID: {
        type: DataTypes.INTEGER
    },
    Type: {
        type: DataTypes.STRING
    },
    MessageURL: {
        type: DataTypes.STRING
    },
    MessageType: {
        type: DataTypes.STRING
    },
    DateTime: {
        type: DataTypes.DATE
    },



}, {
    tableName: 'message_log',
    timestamps: false
});

module.exports = MessageLogModel;