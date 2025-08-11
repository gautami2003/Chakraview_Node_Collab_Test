const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    getAllBusStoppage,
    createBusStoppage,
    updateBusStoppage,
    deleteBusStoppage,
} = require("../../controllers/busStoppage.controller");

// Validators.
const {
    createBusStoppageSchema
} = require("../../validators/busStoppage.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const { idParam } = require("../../validators/common.validator");

router.get(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
    getAllBusStoppage
);

router.post(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([createBusStoppageSchema], [BODY])],
    createBusStoppage
);

router.put(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createBusStoppageSchema], [PARAMS, BODY])],
    updateBusStoppage
);

router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deleteBusStoppage
);

module.exports = router;
