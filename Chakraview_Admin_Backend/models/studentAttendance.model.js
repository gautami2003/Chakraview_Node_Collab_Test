// studentAttendance.model.js
const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const SchoolMasterModel = require('./schoolMaster.model');
const StudentMasterModel = require('./studentMaster.model');
const PickupRouteModel = require('./pickupRouteMaster.model');
const DropRouteMasterModel = require('./dropRouteMaster.model');

const StudentAttendanceModel = sequelize_connection.define('student_attendance', {
  StudentAttendanceID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // change to BIGINT if needed
  BusOperatorID:   { type: DataTypes.INTEGER,   allowNull: false },
  DriverID:        { type: DataTypes.INTEGER,   allowNull: false },
  SchoolID:        { type: DataTypes.INTEGER,   allowNull: false },
  RouteID:         { type: DataTypes.INTEGER,   allowNull: false },
  // DB is varchar(10). If only 'pickup'/'drop' are valid, keep STRING(10) but validate.
  RouteType:       { type: DataTypes.STRING(10), allowNull: false, validate: { isIn: [['pickup','drop']] } },
  StudentID:       { type: DataTypes.INTEGER,   allowNull: false },
  AttendanceType:  { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'qrcode' },

  AttendanceAt:    { type: DataTypes.STRING(10), allowNull: false },

  // DB default: 'Y'
  isPresent:       { type: DataTypes.CHAR(2),    allowNull: false, defaultValue: 'Y' },

  DateTime:        { type: DataTypes.DATE,       allowNull: false },
}, {
  tableName: 'student_attendance',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    { fields: ['BusOperatorID'] },
    { fields: ['StudentID'] },
    { fields: ['SchoolID'] },
    { fields: ['RouteID', 'RouteType'] },
    { fields: ['DateTime'] },
  ],
});

// Associations (polymorphic RouteID; constraints disabled)
StudentAttendanceModel.belongsTo(SchoolMasterModel, {
  foreignKey: 'SchoolID',
  as: 'school_master',
  constraints: false,
});
StudentAttendanceModel.belongsTo(StudentMasterModel, {
  foreignKey: 'StudentID',
  as: 'student_master',
  constraints: false,
});
StudentAttendanceModel.belongsTo(PickupRouteModel, {
  foreignKey: 'RouteID',
  targetKey: 'PickupRouteID',
  as: 'pickup_route',
  constraints: false,
});
StudentAttendanceModel.belongsTo(DropRouteMasterModel, {
  foreignKey: 'RouteID',
  targetKey: 'DropRouteID',
  as: 'drop_route',
  constraints: false,
});

module.exports = StudentAttendanceModel;
