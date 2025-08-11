const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const StudentMasterModel = require('./studentMaster.model');
const StudentAttendanceNotificationLogModel = sequelize_connection.define('student_attendance_notification_log', {
    StudentNotificationLogID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    DriverID: {
        type: DataTypes.INTEGER
    },
    MessageType: {
        type: DataTypes.STRING
    },
    RouteType: {
        type: DataTypes.STRING
    },
    RouteID: {
        type: DataTypes.INTEGER
    },
    MessageURL: {
        type: DataTypes.STRING
    },
    StudentID: {
        type: DataTypes.INTEGER
    },
    Latitude: {
        type: DataTypes.DOUBLE
    },
    Longitude: {
        type: DataTypes.DOUBLE
    },
    DateTime: {
        type: DataTypes.DATE
    },
}, {
    tableName: 'student_attendance_notification_log',
    timestamps: false
});

StudentAttendanceNotificationLogModel.belongsTo(StudentMasterModel, { foreignKey: 'StudentID' });
module.exports = StudentAttendanceNotificationLogModel;