const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    getAllStoppageTiming,
    createStoppageTiming,
    updateStoppageTiming,
    deleteStoppageTiming,
} = require("../../controllers/routeStoppageTiming.controller");

// Validators.
const {
    createStoppageTimingSchema
} = require("../../validators/routeStoppageTiming.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const { idParam } = require("../../validators/common.validator");

router.get(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
    getAllStoppageTiming
);

router.post(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([createStoppageTimingSchema], [BODY])],
    createStoppageTiming
);

router.put(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createStoppageTimingSchema], [PARAMS, BODY])],
    updateStoppageTiming
);

router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deleteStoppageTiming
);

module.exports = router;
