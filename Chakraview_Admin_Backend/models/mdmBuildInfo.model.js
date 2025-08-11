const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const MdmBuildInfoModel = sequelize_connection.define('mdm_build_info', {
    BuildInfoID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    IMEI: {
        type: DataTypes.STRING
    },
    DateTime: {
        type: DataTypes.DATE
    },
    APILevel: {
        type: DataTypes.STRING
    },
    BaseOS: {
        type: DataTypes.STRING
    },
    Board: {
        type: DataTypes.STRING
    },
    BootLoader: {
        type: DataTypes.STRING
    },
    BuildNumber: {
        type: DataTypes.STRING
    },
    
    Device: {
        type: DataTypes.STRING
    },
    Hardware: {
        type: DataTypes.STRING
    },
    ID: {
        type: DataTypes.STRING
    },
    KernelVersion: {
        type: DataTypes.STRING
    },
    Manufacturer: {
        type: DataTypes.STRING
    },
    Model: {
        type: DataTypes.STRING
    },
    Product: {
        type: DataTypes.STRING
    },
    SecurityPatch: {
        type: DataTypes.DATE
    },

}, {
    tableName: 'mdm_build_info',
    timestamps: false
});

module.exports = MdmBuildInfoModel;

