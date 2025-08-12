const { DB_MODELS } = require('../constants/models.constant');

const { PAYMENT_SUBSCRIPTION_HISTORY, SCHOOL_MASTER} = DB_MODELS;


const getAllPaymentSub = async (busOperatorId) => {
  if (!busOperatorId) {
    throw new Error("Bus Operator ID is required");
  }

  const paymentSubs = await PAYMENT_SUBSCRIPTION_HISTORY.findAll({
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

  return paymentSubs;
};

module.exports = {
  getAllPaymentSub,
};