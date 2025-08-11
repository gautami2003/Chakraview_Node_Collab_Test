const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    getGpsData
} = require("../../controllers/gps.controller");

// Validators.
const {
    getGpsDataSchema
} = require("../../validators/gps.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");

router.get(
    "/get-gps-data",
    [jwtValidatorMiddleware, requestValidatorMiddleware([getGpsDataSchema], [QUERY])],
    getGpsData
);


module.exports = router;
