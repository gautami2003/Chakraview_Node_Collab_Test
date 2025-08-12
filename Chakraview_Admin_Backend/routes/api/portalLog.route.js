const express = require("express");
const router = express.Router();

// Controller methods.
const { getAllPortalLog } = require("../../controllers/portalLog.controller");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");

// GET /parentLogMaster — secured route
router.get(
  "/",
  [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
  getAllPortalLog
);

module.exports = router;
