const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const ParentAppMobileSmsLogModel = sequelize_connection.define('parent_app_mobile_sms_log', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    phone: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.INTEGER
    },
    sms_gateway_url: {
        type: DataTypes.STRING
    },
    sms_gateway_response: {
        type: DataTypes.STRING
    },
    dt: {
        type: DataTypes.DATE
    },
    sms_session_id: {
        type: DataTypes.STRING
    },
    imei: {
        type: DataTypes.STRING
    },
}, {
    tableName: 'parent_app_mobile_sms_log',
    timestamps: false
});

module.exports = ParentAppMobileSmsLogModel;