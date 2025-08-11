const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const MdmBatteryStatusModel = sequelize_connection.define('mdm_battery_status', {
    BatteryStatusID: {
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
    BatteryLevel: {
        type: DataTypes.STRING
    },
    ChargingMode: {
        type: DataTypes.STRING
    },
    USB: {
        type: DataTypes.STRING
    },
    Temperature: {
        type: DataTypes.STRING
    },
    Voltage: {
        type: DataTypes.STRING
    },
    
    isCharging: {
        type: DataTypes.STRING
    },

}, {
    tableName: 'mdm_battery_status',
    timestamps: false
});

module.exports = MdmBatteryStatusModel;

