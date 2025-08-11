const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const ApiErrorLogsModel = sequelize_connection.define('error_logs', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    request_url: {
        type: DataTypes.STRING
    },
    request_payload: {
        type: DataTypes.STRING
    },
    function: {
        type: DataTypes.STRING
    },
    message: {
        type: DataTypes.STRING
    },
    stack: {
        type: DataTypes.INTEGER
    },
    created_at: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'error_logs',
    timestamps: false
});

module.exports = ApiErrorLogsModel