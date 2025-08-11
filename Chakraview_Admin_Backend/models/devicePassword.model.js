const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const DeviceMasterModel = sequelize_connection.define('device_password', {
    DevicePasswordID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Password: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'device_password',
    timestamps: false
});

module.exports = DeviceMasterModel;