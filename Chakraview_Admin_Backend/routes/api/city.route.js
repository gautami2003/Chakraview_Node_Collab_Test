const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    getCity,
} = require("../../controllers/city.controller");

// Validators.
const {
    getCitySchema
} = require("../../validators/city.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const { idParam } = require("../../validators/common.validator");

router.get(
    "/",
    [requestValidatorMiddleware([getCitySchema], [QUERY])],
    getCity
);


module.exports = router;
