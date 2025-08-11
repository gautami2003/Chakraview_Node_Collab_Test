const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    getCountry,
} = require("../../controllers/country.controller");

// Validators.
// const {
// } = require("../../validators/getCountry.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const { idParam } = require("../../validators/common.validator");

router.get(
    "/",
    [requestValidatorMiddleware([], [])],
    getCountry
);


module.exports = router;
