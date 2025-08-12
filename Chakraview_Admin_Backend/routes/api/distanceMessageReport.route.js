const express = require("express");
const router = express.Router();

// Controller methods.
const { getAllDistanceMessageLogReport } = require("../../controllers/distanceMessageReport.controller");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");

// GET /parentLogMaster — secured route
router.get(
  "/",
  [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
  getAllDistanceMessageLogReport
);

module.exports = router;