// services/studentAttendanceNotificationLog.services.js
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const StudentAttendanceNotificationLog =
  require('../models/studentAttendanceNotificationLog.model');
const SchoolMaster = require('../models/schoolMaster.model');
const StudentMaster = require('../models/studentMaster.model');
const PickupRouteMaster = require('../models/pickupRouteMaster.model');
const DropRouteMaster = require('../models/dropRouteMaster.model');
const BusInchargeMasterModel = require('../models/busInchargeMaster.model');

const getStudentAttendanceNotificationLogs = async (busOperatorId, filters = {}) => {
  if (!busOperatorId) throw new Error('Bus Operator ID is required');

  const where = { BusOperatorID: busOperatorId };

  if (filters.schoolId) where.SchoolID = filters.schoolId;
  if (filters.driverId) where.DriverID = filters.driverId;
  if (filters.routeType && filters.routeType !== 'All') where.RouteType = filters.routeType;
  if (filters.routeId) where.RouteID = filters.routeId;
  if (filters.studentId) where.StudentID = filters.studentId;
  if (filters.messageType) where.MessageType = filters.messageType;

  if (filters.from || filters.to) {
    where.DateTime = {};
    if (filters.from) where.DateTime[Op.gte] = new Date(filters.from);
    if (filters.to) {
      const end = new Date(filters.to);
      end.setHours(23, 59, 59, 999);
      where.DateTime[Op.lte] = end;
    }
  }

  // Guard to surface wiring issues early
  if (!StudentAttendanceNotificationLog?.findAll) {
    throw new Error('StudentAttendanceNotificationLog model is not initialized or not exported correctly');
  }

  return StudentAttendanceNotificationLog.findAll({
    where,
    attributes: { exclude: [] },
    include: [
      { model: SchoolMaster,as: 'school_master', attributes: ['SchoolName'] },
      { model: StudentMaster, attributes: ['StudentName'] },
      { model: PickupRouteMaster, as: 'pickup_route', attributes: ['RouteName'], required: false },
      { model: DropRouteMaster,   as: 'drop_route',   attributes: ['RouteName'], required: false },
      { model: BusInchargeMasterModel,   as: 'bus_incharge_master',   attributes: ['DriverName'], required: false },
    ],
    order: [['DateTime', 'DESC']],
  });
};

module.exports = { getStudentAttendanceNotificationLogs };
