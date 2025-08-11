const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Kolkata");

const parentLogService = require("../services/parentLogMaster.service");
const { COMMON_MESSAGES } = require("../constants/messages.constant");
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");

const getAllParentLog = async (req, res) => {
  try {
    const busOperatorId = req.user?.busOperatorID;

    if (!busOperatorId) {
      return apiHelper.failure(res, "Bus Operator ID missing from token", null, 400);
    }

    const parentLogs = await parentLogService.getAllParentLog(busOperatorId);

    if (!Array.isArray(parentLogs)) {
      return apiHelper.failure(res, "Invalid data received from service", null, 500);
    }

    const result = parentLogs.map((data) => {
      const loginDateTime =
        data.LoginDateTime && moment(data.LoginDateTime).isValid()
          ? moment(data.LoginDateTime).format("DD-MM-YYYY HH:mm:ss")
          : "";

      const mapDateTime =
        data.MapDateTime && moment(data.MapDateTime).isValid()
          ? moment(data.MapDateTime).format("DD-MM-YYYY HH:mm:ss")
          : "";

      const logoutDateTime =
        data.LogoutDateTime && moment(data.LogoutDateTime).isValid()
          ? moment(data.LogoutDateTime).format("DD-MM-YYYY HH:mm:ss")
          : "";

        let totalDuration = "";

        if (
        data.LoginDateTime &&
        data.LogoutDateTime &&
        data.LoginDateTime !== "" &&
        data.LogoutDateTime !== "" &&
        data.LogoutDateTime !== null &&
        data.LoginDateTime !== null &&
        moment(data.LoginDateTime).isValid() &&
        moment(data.LogoutDateTime).isValid()
        ) {
        const duration = moment(data.LogoutDateTime).diff(moment(data.LoginDateTime), "minutes");

        if (!isNaN(duration) && duration >= 0) {
            totalDuration = `${duration} mins`;
        }
        }



      return {
        parentLogID: data.ParentLogID,
        studentName: data.student_master?.StudentName || "",
        schoolName: data.school_master?.SchoolName || "",
        type: data.Type || "",
        routeID: data.RouteID || "",
        mobileNumber: data.MobileNumber || "",
        os: data.OS || "",
        loginDateTime,
        mapDateTime,
        logoutDateTime,
        routeName:
          data.Type === "Pickup"
            ? data.pickup_route?.RouteName || ""
            : data.Type === "Drop"
            ? data.drop_route?.RouteName || ""
            : "",
        totalDuration,
      };
    });

    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
  } catch (error) {
    await logError(req, res, "parentLogMaster", "getAllParentLog", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message || "Unknown error");
  }
};

module.exports = {
  getAllParentLog,
};
