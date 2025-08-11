const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const PortalMessageLogModel = sequelize_connection.define('portal_message_log', {
    PortalMessageLogID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    page: {
        type: DataTypes.STRING
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    PickupRouteID: {
        type: DataTypes.INTEGER
    },
    DropRouteID: {
        type: DataTypes.INTEGER
    },
    StudentStandard: {
        type: DataTypes.STRING
    },
    Message: {
        type: DataTypes.STRING
    },
    DateTime: {
        type: DataTypes.DATE
    },
}, {
    tableName: 'portal_message_log',
    timestamps: false
});

module.exports = PortalMessageLogModel;