const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const DRIVERROUTETRANSACTIONREFERENCEModel = sequelize_connection.define('driver_route_transaction_reference', {
    DriverRouteTransactionReferenceID : {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    DriverRouteTransactionID: {
        type: DataTypes.INTEGER
    },
    DriverID: {
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
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    BusID: {
        type: DataTypes.INTEGER
    },
   
    DateTime: {
        type: DataTypes.DATE
    },
    isRunning: {
        type: DataTypes.STRING
    },
    isLogout: {
        type: DataTypes.STRING
    },
    LogoutDateTime: {
        type: DataTypes.DATE
    },
    VideoPath: {
        type: DataTypes.STRING
    },
    VideoDateTime: {
        type: DataTypes.DATE
    },



}, {
    tableName: 'driver_route_transaction_reference',
    timestamps: false
});

module.exports = DRIVERROUTETRANSACTIONREFERENCEModel;