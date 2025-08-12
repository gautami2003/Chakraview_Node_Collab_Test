const { DB_MODELS } = require('../constants/models.constant');

const { PORTAL_MESSAGE_LOG, SCHOOL_MASTER} = DB_MODELS;


const getAllPortalLog = async (busOperatorId) => {
  if (!busOperatorId) {
    throw new Error("Bus Operator ID is required");
  }

  const portalLogs = await PORTAL_MESSAGE_LOG.findAll({
    where: { BusOperatorID: busOperatorId },
    attributes: { exclude: [] },
    include: [
      {
        model: SCHOOL_MASTER,
        as: 'school_master',
        attributes: ['SchoolName'],
      },
    ],
  });

  return portalLogs;
};

module.exports = {
  getAllPortalLog,
};