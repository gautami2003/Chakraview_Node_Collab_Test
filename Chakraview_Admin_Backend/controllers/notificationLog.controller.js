// controllers/studentAttendanceNotificationLog.controller.js
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Kolkata");

const notifService = require("../services/notificationLog.service");
const { COMMON_MESSAGES } = require("../constants/messages.constant");
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");

const fmtDT = (v) =>
  v && moment(v).isValid() ? moment(v).format("DD-MM-YYYY HH:mm:ss") : "";

const getAllNotificationReport = async (req, res) => {
  try {
    const busOperatorId =
      req.user?.busOperatorID ?? req.user?.BusOperatorID ?? null;

    if (!busOperatorId) {
      return apiHelper.failure(
        res,
        "Bus Operator ID missing from token",
        null,
        400
      );
    }

    // Fetch data (data-only service)
    const rows = await notifService.getAllNotificationReport(
      busOperatorId
    );

    if (!Array.isArray(rows)) {
      return apiHelper.failure(
        res,
        "Invalid data received from service",
        null,
        500
      );
    }

   const result = rows.map((r) => {
  const routeType = r.Type ?? "";

  const routeName =
    (routeType === "Pickup"
      ? r.pickup_route?.RouteName
      : routeType === "Drop"
      ? r.drop_route?.RouteName
      : r.RouteName) || "";

  return {
    "Bus Attendant":
      r.driver_route_transaction?.bus_incharge_master?.DriverName ?? "",
    School:
      r.school_master?.SchoolName ?? "",
    RouteName: routeName,
    RouteType: r.Type,
    MobileNumbers: r.MobileNumbers,
    MessageTitle: r.MessageTitle,
    MessageType: r.MessageType,
    MessageURL: r.MessageURL ?? "",
    DateTime: fmtDT(r.DateTime),
  };
});


    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
  } catch (error) {
    await logError(
      req,
      res,
      "getAllNotificationReport",
      "getAllNotificationReport",
      error,
      {}
    );
    return apiHelper.failure(
      res,
      COMMON_MESSAGES.SOME_ERROR,
      error.message || "Unknown error"
    );
  }
};

module.exports = { getAllNotificationReport };
