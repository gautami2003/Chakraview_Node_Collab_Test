const express = require("express");
const router = express.Router();

// Controller methods.
const { getAllParentLog } = require("../../controllers/parentLogMaster.controller");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");

// GET /parentLogMaster — secured route
router.get(
  "/",
  [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
  getAllParentLog
);

module.exports = router;
