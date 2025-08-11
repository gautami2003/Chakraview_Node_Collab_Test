const express = require("express");
const router = express.Router();

// Controller methods.
const { getDashboardCounts } = require("../../controllers/dashboard.controller");

// Middlewares.
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");

router.get(
    "/",
    jwtValidatorMiddleware,
    getDashboardCounts
);


module.exports = router;