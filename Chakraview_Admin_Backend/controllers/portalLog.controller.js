const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Kolkata");

const portalLogService = require("../services/portalLog.service");
const { COMMON_MESSAGES } = require("../constants/messages.constant");
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");

const getAllPortalLog = async (req, res) => {
  try {
    const busOperatorId = req.user?.busOperatorID;

    if (!busOperatorId) {
      return apiHelper.failure(res, "Bus Operator ID missing from token", null, 400);
    }

    const portalLogs = await portalLogService.getAllPortalLog(busOperatorId);

    if (!Array.isArray(portalLogs)) {
      return apiHelper.failure(res, "Invalid data received from service", portalLogs, 500);
    }

    const result = portalLogs.map((data) => ({
      portalMessageLogID: data.PortalMessageLogID,
      schoolName: data.school_master?.SchoolName || "",
      mobileNumber: data.MobileNumbers || "",
      message: data.Message || "",
      dateTime: data.DateTime || "",
      page: data.page || "",
    }));

    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
  } catch (error) {
    await logError(req, res, "portalLog", "getAllPortalLog", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message || "Unknown error");
  }
};

module.exports = {
  getAllPortalLog,
};
