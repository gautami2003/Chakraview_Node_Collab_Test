const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const StudentMasterModel = require('./studentMaster.model');
const SchoolMasterModel = require('./schoolMaster.model');
const PickupRouteModel = require('./pickupRouteMaster.model');
const DropRouteMasterModel = require('./dropRouteMaster.model');
const BusInchargeMasterModel = require('./busInchargeMaster.model');
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

// Association to SchoolMasterModel
StudentAttendanceNotificationLogModel.belongsTo(SchoolMasterModel, {
  foreignKey: 'SchoolID',  // column in parent_log table linking to school_master
  as: 'school_master',     // alias used in include queries
});
StudentAttendanceNotificationLogModel.belongsTo(StudentMasterModel, {
  foreignKey: 'StudentID',  // column in parent_log table linking to school_master
  as: 'student_master',     // alias used in include queries
});
// Association to PickupRouteMasterModel
StudentAttendanceNotificationLogModel.belongsTo(PickupRouteModel, {
  foreignKey: 'RouteID',
  targetKey: 'PickupRouteID',
  as: 'pickup_route',
});

// Association to DropRouteMasterModel
StudentAttendanceNotificationLogModel.belongsTo(DropRouteMasterModel, {
  foreignKey: 'RouteID',
  targetKey: 'DropRouteID',
  as: 'drop_route',
});

StudentAttendanceNotificationLogModel.belongsTo(BusInchargeMasterModel, {
  foreignKey: 'DriverID',
  as: 'bus_incharge_master',
});
StudentAttendanceNotificationLogModel.belongsTo(StudentMasterModel, { foreignKey: 'StudentID' });
module.exports = StudentAttendanceNotificationLogModel;