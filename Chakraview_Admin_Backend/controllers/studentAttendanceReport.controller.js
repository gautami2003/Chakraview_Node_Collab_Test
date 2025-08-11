const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Kolkata");

const studentAttendanceService = require("../services/studentAttendanceReport.service");
const { COMMON_MESSAGES } = require("../constants/messages.constant");
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");

const getAllStudentAttendance = async (req, res) => {
  try {
    const busOperatorId = req.user?.busOperatorID;

    if (!busOperatorId) {
      return apiHelper.failure(res, "Bus Operator ID missing from token", null, 400);
    }

    const studentAttendance = await studentAttendanceService.getAllStudentAttendance(busOperatorId);

    if (!Array.isArray(studentAttendance)) {
      return apiHelper.failure(res, "Invalid data received from service", null, 500);
    }

// studentAttendanceReport.controller.js (inside getAllStudentAttendance)
const result = studentAttendance.map((data) => {
  const dateTime =
    data.DateTime && moment(data.DateTime).isValid()
      ? moment(data.DateTime).format("DD-MM-YYYY HH:mm:ss")
      : "";

  const routeType = String(data.RouteType || "").toLowerCase();

  const routeName =
    routeType === "pickup"
      ? data.pickup_route?.RouteName || ""
      : routeType === "drop"
      ? data.drop_route?.RouteName || ""
      : "";

  return {
    // use the correct attribute names/case from the model
    studentAttendanceID: data.StudentAttendanceID,
    studentName: data.student_master?.StudentName || "",
    schoolName: data.school_master?.SchoolName || "",
    attendanceType: data.AttendanceType ?? "",   // now matches the DB/model
    // if you want to keep the key as "type", map it from RouteType
    type: data.RouteType || "",
    routeID: data.RouteID || "",
    dateTime,
    routeName,
  };
});

    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
  } catch (error) {
    await logError(req, res, "studentAttendance", "getAllStudentAttendance", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message || "Unknown error");
  }
};

module.exports = {
  getAllStudentAttendance,
};
