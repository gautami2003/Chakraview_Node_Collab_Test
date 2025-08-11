const { DB_MODELS } = require('../constants/models.constant');

const { PARENT_LOG, SCHOOL_MASTER, STUDENT_MASTER , PICKUP_ROUTE_MASTER, DROP_ROUTE_MASTER} = DB_MODELS;


const getAllParentLog = async (busOperatorId) => {
  if (!busOperatorId) {
    throw new Error("Bus Operator ID is required");
  }

  const parentLogs = await PARENT_LOG.findAll({
    where: { BusOperatorID: busOperatorId },
    attributes: { exclude: [] }, // all columns from PARENT_LOG are included
    include: [
      {
        model: SCHOOL_MASTER,
        as: 'school_master',
        attributes: ['SchoolName'], // Only SchoolName from SCHOOL_MASTER
      },
      {
        model: STUDENT_MASTER,
        as: 'student_master',
        attributes: ['StudentName'], // Only StudentName from STUDENT_MASTER
      },
       {
        model: PICKUP_ROUTE_MASTER,
        as: 'pickup_route',
        attributes: ['RouteName'],
      },
      {
        model: DROP_ROUTE_MASTER,
        as: 'drop_route',
        attributes: ['RouteName'],
      },
    ],
  });

  return parentLogs;
};

module.exports = {
  getAllParentLog,
};