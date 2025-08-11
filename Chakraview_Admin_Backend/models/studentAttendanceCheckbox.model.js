const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const StudentAttendanceCheckboxModel = sequelize_connection.define('student_attendance_checkbox', {
    StudentAttendanceID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    DriverID: {
        type: DataTypes.INTEGER
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    RouteID: {
        type: DataTypes.INTEGER
    },
    RouteType: {
        type: DataTypes.STRING
    },
    StudentID: {
        type: DataTypes.INTEGER
    },
    isPresent: {
        type: DataTypes.STRING
    },
    
    DateTime: {
        type: DataTypes.DATE
    },

}, {
    tableName: 'student_attendance_checkbox',
    timestamps: false
});

module.exports = StudentAttendanceCheckboxModel;