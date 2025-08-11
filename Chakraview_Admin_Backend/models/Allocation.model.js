const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const AllocationModel = sequelize_connection.define('Allocation', {
    AllocationID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    DeviceSerialNumber: {
        type: DataTypes.INTEGER
    },
    SimSerialNumber: {
        type: DataTypes.STRING
    },
    School: {
        type: DataTypes.STRING
    },
    RouteNumber: {
        type: DataTypes.STRING
    },
    Attendant: {
        type: DataTypes.STRING
    },
    DeviceSubmitDate: {
        type: DataTypes.DATE
    },
    Device_Submit_Person: {
        type: DataTypes.STRING
    },
    DateTime: {
        type: DataTypes.DATE
    },
    isActive: {
        type: DataTypes.STRING
    },
    isDeleted: {
        type: DataTypes.STRING
    },
    UpdatedBy: {
        type: DataTypes.STRING,
    },
    UpdatedOn: {
        type: DataTypes.DATE,
    },
    CreatedBy: {
        type: DataTypes.STRING
    },

}, {
    tableName: 'Allocation',
    timestamps: false
});

module.exports = AllocationModel;

