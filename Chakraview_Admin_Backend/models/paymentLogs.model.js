const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const PaymentLogsModel = sequelize_connection.define('payment_logs', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    payment_gateway: {
        type: DataTypes.STRING
    },
    logs: {
        type: DataTypes.JSON
    },
}, {
    tableName: 'payment_logs',
    timestamps: false
});


module.exports = PaymentLogsModel;