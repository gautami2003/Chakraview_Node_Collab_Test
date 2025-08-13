const express = require("express");
const router = express.Router();

// Controller methods.
const { getAllNotificationReport } = require("../../controllers/notificationLog.controller");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");

// GET /parentLogMaster — secured route
router.get(
  "/",
  [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
  getAllNotificationReport
);

module.exports = router;
