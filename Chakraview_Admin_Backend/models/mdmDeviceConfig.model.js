const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const MdmDeviceConfigModel = sequelize_connection.define('mdm_device_config', {
    DeviceConfigID: {
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
    DisplayCountry: {
        type: DataTypes.STRING
    },
    DensityDpi: {
        type: DataTypes.STRING
    },
    DisplayLanguage: {
        type: DataTypes.STRING
    },
    Fontscale: {
        type: DataTypes.STRING
    },
    LayoutDirection: {
        type: DataTypes.STRING
    },
    
    MobileCountryCode: {
        type: DataTypes.STRING
    },
    Orientation: {
        type: DataTypes.STRING
    },
    ScreenHeight: {
        type: DataTypes.STRING
    },
    ScreenWidth: {
        type: DataTypes.STRING
    },
    TimeZone: {
        type: DataTypes.STRING
    },

}, {
    tableName: 'mdm_device_config',
    timestamps: false
});

module.exports = MdmDeviceConfigModel;

