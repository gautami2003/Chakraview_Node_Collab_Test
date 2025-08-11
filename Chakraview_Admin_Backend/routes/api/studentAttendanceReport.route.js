const express = require("express");
const router = express.Router();

// Controller methods.
const { getAllStudentAttendance } = require("../../controllers/studentAttendanceReport.controller");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");

// GET /studentAttendanceReport — secured route
router.get(
  "/",
  [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
  getAllStudentAttendance
);

module.exports = router;