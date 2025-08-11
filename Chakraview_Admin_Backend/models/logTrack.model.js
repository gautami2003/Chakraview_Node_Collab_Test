const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const LogTrackModel = sequelize_connection.define('log_track', {
    LogTrackID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    DriverRouteTransactionID: {
        type: DataTypes.INTEGER
    },
    
    Latitude: {
        type: DataTypes.DOUBLE
    },
    Longitude: {
        type: DataTypes.DOUBLE
    },
    
    MetersTravelled: {
        type: DataTypes.STRING
    },
    Speed :{
        type: DataTypes.STRING
    },
    provider: {
        type: DataTypes.STRING
    },
    accuracy: {
        type: DataTypes.FLOAT
    },
    Address: {
        type: DataTypes.STRING
    },
    isOffline : {
        type: DataTypes.STRING
    },
    
    DateTime: {
        type: DataTypes.DATE
    },



}, {
    tableName: 'log_track',
    timestamps: false
});

module.exports = LogTrackModel ;