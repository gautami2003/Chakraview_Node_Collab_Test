const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant.js");

// Controller methods.
const {
    getAllBus,
    createBus,
    updateBus,
    deleteBus,
} = require("../../controllers/busMaster.controller.js");

// Validators.
const {
    createBusSchema,
} = require("../../validators/busMaster.validator.js");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware.js");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware.js");
const { idParam } = require("../../validators/common.validator.js");

router.get(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
    getAllBus
);

router.post(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([createBusSchema], [BODY])],
    createBus
);

router.put(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createBusSchema], [PARAMS, BODY])],
    updateBus
);

router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deleteBus
);

module.exports = router;
