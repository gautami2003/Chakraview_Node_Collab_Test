// controllers/distanceMessageLog.controller.js
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Kolkata");

const distanceMessageLogService = require("../services/distanceMessageLog.services");
const { COMMON_MESSAGES } = require("../constants/messages.constant");
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");

const fmtDT = (v) =>
  v && moment(v).isValid() ? moment(v).format("DD-MM-YYYY HH:mm:ss") : "";

const getAllDistanceMessageLogReport = async (req, res) => {
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

    const rows =
      await distanceMessageLogService.getAllDistanceMessageLogReport(
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

    const result = rows.map((row) => {
      const type =
        row.Type ??
        row.driver_route_transaction?.Type ??
        "";

      // Resolve RouteName via Type (fallback if Type missing)
      const resolvedRouteName =
        (type === "Pickup"
          ? row.pickup_route?.RouteName
          : type === "Drop"
          ? row.drop_route?.RouteName
          : row.pickup_route?.RouteName || row.drop_route?.RouteName || row.RouteName) ?? "";

      // Driver + transaction
      const driverName =
        row.driver_route_transaction?.bus_incharge_master?.DriverName ?? "";

      const transactionId =
        row.DriverRouteTransactionID ??
        row.driver_route_transaction?.DriverRouteTransactionID ??
        null;

      const transactionDT =
        row.driver_route_transaction?.DateTime ?? null;

      // Stoppage name (handle both spellings)
      const stoppageName =
        row.stoppage_master?.StoppageName ??
        row.stoppage_master?.StopageName ??
        "";

      // Message fields (model has MessageURL + MobileNumber)
      const message = row.MessageURL ?? "";
      const messageRecipient = row.MobileNumber ?? "";

      // Distance + timestamps
      const distanceMeters = Number(row.Distance) || 0;
      const messageDT = row.DateTime ?? null;

      return {
        DriverName: driverName,
        "Driver Route": resolvedRouteName,
        TransactionID: transactionId,
        "DateTime For TransactionID": fmtDT(transactionDT),
        School: row.school_master?.SchoolName ?? "",
        "Route (Stoppage)": stoppageName,
        Message: message,
        "Message Recipient": messageRecipient,
        "Distance (meters)": distanceMeters,
        "DateTime For Message": fmtDT(messageDT),
        Type: type,
        RouteName: resolvedRouteName,
      };
    });

    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
  } catch (error) {
    await logError(
      req,
      res,
      "distanceMessageLog",
      "getAllDistanceMessageLogReport",
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

module.exports = { getAllDistanceMessageLogReport };
