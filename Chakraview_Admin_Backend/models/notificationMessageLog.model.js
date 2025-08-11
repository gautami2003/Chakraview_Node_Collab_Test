const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const NotificationMessageLogModel = sequelize_connection.define('notificationmessage_log', {
    NotificationMessageLogID: {
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
    Message: {
        type: DataTypes.INTEGER
    },
    MessageCount: {
        type: DataTypes.INTEGER
    },
    MessageURL: {
        type: DataTypes.STRING
    },
    MessageType: {
        type: DataTypes.STRING
    },
    MobileNumber: {
        type: DataTypes.STRING
    },
    StoppageID: {
        type: DataTypes.INTEGER
    },
    Distance: {
        type: DataTypes.DOUBLE
    },
    DateTime: {
        type: DataTypes.DATE
    },
    Success: {
        type: DataTypes.STRING
    }



}, {
    tableName: 'notificationmessage_log',
    timestamps: false
});

module.exports = NotificationMessageLogModel;