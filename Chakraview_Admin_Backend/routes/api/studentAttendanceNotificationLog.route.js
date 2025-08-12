const express = require("express");
const router = express.Router();

// Controller methods.
const { getAllStudentAttendanceNotificationLogs } = require("../../controllers/studentAttendanceNotificationLog.controller");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");

// GET /parentLogMaster — secured route
router.get(
  "/",
  [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
  getAllStudentAttendanceNotificationLogs
);

module.exports = router;
