const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const DriverRouteTransactionModel = require('./driverRouteTransaction.model');
const BusMasterModel = sequelize_connection.define('bus_master', {
    BusID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    BusName: {
        type: DataTypes.STRING
    },
    BusSeats: {
        type: DataTypes.INTEGER
    },
    BusRegistrationNumber: {
        type: DataTypes.STRING
    },
    BusChasisNumber: {
        type: DataTypes.STRING
    },
    BusRegistrationDate: {
        type: DataTypes.DATE
    },
    GPSDeviceIMEINo: {
        type: DataTypes.STRING
    },
    GPSDeviceMobileNumber: {
        type: DataTypes.STRING
    },
    isDeleted: {
        type: DataTypes.STRING
    },
    CreatedBy: {
        type: DataTypes.STRING
    },
    CreatedOn: {
        type: DataTypes.DATE
    },
    UpdatedBy: {
        type: DataTypes.STRING
    },
    UpdatedOn: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'bus_master',
    timestamps: false
});
BusMasterModel.belongsTo(DriverRouteTransactionModel, { foreignKey: 'BusID', targetKey: 'BusID' });
module.exports = BusMasterModel;