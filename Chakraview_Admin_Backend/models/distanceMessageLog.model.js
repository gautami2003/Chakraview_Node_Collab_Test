const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const DistanceMessageLogModel = sequelize_connection.define('distance_message_log', {
    DistanceMessageLogID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    DriverRouteTransactionID: {
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
    StoppageID: {
        type: DataTypes.INTEGER
    },
    MessageURL: {
        type: DataTypes.STRING
    },
    MessageCount: {
        type: DataTypes.INTEGER
    },
    Latitude: {
        type: DataTypes.DOUBLE
    },
    Longitude: {
        type: DataTypes.DOUBLE
    },
    Distance: {
        type: DataTypes.DOUBLE
    },
    DateTime: {
        type: DataTypes.DATE
    },



}, {
    tableName: 'distance_message_log',
    timestamps: false
});

module.exports = DistanceMessageLogModel;