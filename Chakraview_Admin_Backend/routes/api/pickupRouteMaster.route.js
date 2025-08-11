const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    getAllPickupRoute,
    createPickupRoute,
    updatePickupRoute,
    deletePickupRoute,
} = require("../../controllers/pickupRouteMaster.controller");

// Validators.
const {
    createPickupRouteSchema
} = require("../../validators/pickupRouteMaster.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const { idParam } = require("../../validators/common.validator");

router.get(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
    getAllPickupRoute
);

router.post(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([createPickupRouteSchema], [BODY])],
    createPickupRoute
);

router.put(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createPickupRouteSchema], [PARAMS, BODY])],
    updatePickupRoute
);

router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deletePickupRoute
);

module.exports = router;
