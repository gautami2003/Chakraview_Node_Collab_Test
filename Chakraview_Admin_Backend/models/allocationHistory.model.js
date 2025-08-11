const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const AllocationHistoryModel = sequelize_connection.define('allocation_history', {
    HAllocationID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    SimSerialNumber: {
        type: DataTypes.INTEGER
    },
    DeviceSerialNumber: {
        type: DataTypes.BIGINT
    },
    School: {
        type: DataTypes.STRING
    },
    Attendant: {
        type: DataTypes.STRING
    },
    DeviceSubmitDate: {
        type: DataTypes.DATE
    },
    DeviceSubmitPerson: {
        type: DataTypes.STRING
    },
    Type: {
        type: DataTypes.STRING
    },
    CreatedOn: {
        type: DataTypes.DATE
    },
    CreatedBy: {
        type: DataTypes.STRING
    },
    RouteNumber: {
        type: DataTypes.STRING,
    },

}, {
    tableName: 'allocation_history',
    timestamps: false
});

module.exports = AllocationHistoryModel;

