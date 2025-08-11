const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const WebhookLogsModel = sequelize_connection.define('webhook_logs', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    logs: {
        type: DataTypes.JSON
    },
}, {
    tableName: 'webhook_logs',
    timestamps: false
});


module.exports = WebhookLogsModel;