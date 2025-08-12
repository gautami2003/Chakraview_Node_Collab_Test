const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Kolkata");

const paymentSubService = require("../services/paymentSub.service");
const { COMMON_MESSAGES } = require("../constants/messages.constant");
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");

const getAllPaymentSub = async (req, res) => {
  try {
    const busOperatorId = req.user?.busOperatorID;

    if (!busOperatorId) {
      return apiHelper.failure(res, "Bus Operator ID missing from token", null, 400);
    }

    const paymentSubs = await paymentSubService.getAllPaymentSub(busOperatorId);

    if (!Array.isArray(paymentSubs)) {
      return apiHelper.failure(res, "Invalid data received from service", paymentSubs, 500);
    }

    const result = paymentSubs.map((data) => ({
      subno: data.Subno,
      schoolName: data.school_master?.SchoolName || "",
      phone: data.phone || "",
      name: data.name || "",
      initiatedt: data.initiatedt || "",
      email: data.email || "",
    }));

    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
  } catch (error) {
    await logError(req, res, "paymentSubs", "getAllPaymentSub", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message || "Unknown error");
  }
};

module.exports = {
  getAllPaymentSub,
};
