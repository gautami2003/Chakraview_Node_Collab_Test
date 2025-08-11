const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const MdmBluetoothStatusModel = sequelize_connection.define('mdm_bluetooth_status', {
    BluetoothStatus: {
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
    isEnabled: {
        type: DataTypes.STRING
    },
    Address: {
        type: DataTypes.STRING
    },
    Name: {
        type: DataTypes.STRING
    },



}, {
    tableName: 'mdm_bluetooth_status',
    timestamps: false
});

module.exports = MdmBluetoothStatusModel;

