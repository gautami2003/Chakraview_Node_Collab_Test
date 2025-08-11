const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const SettingsModel = sequelize_connection.define('settings', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    value: {
        type: DataTypes.STRING
    },
}, {
    tableName: 'settings',
    timestamps: false
});

module.exports = SettingsModel;