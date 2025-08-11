const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const StudentMasterModel = require('./studentMaster.model');
const NotificationLogModel = sequelize_connection.define('notification_log', {
    NotificationLogID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    DriverRouteTransactionID: {
        type: DataTypes.INTEGER
    },
    BusID: {
        type: DataTypes.INTEGER
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    RouteID: {
        type: DataTypes.INTEGER
    },
    Type: {
        type: DataTypes.STRING
    },
    MessageURL: {
        type: DataTypes.STRING
    },
    MessageType: {
        type: DataTypes.STRING
    },
    DateTime: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'notification_log',
    timestamps: false
});

NotificationLogModel.belongsTo(StudentMasterModel, { foreignKey: 'SchoolID', targetKey: 'SchoolID' });
module.exports = NotificationLogModel;