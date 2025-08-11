const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    getAllBusIncharge,
    getAttendantType,
    createBusIncharge,
    updateBusIncharge,
    deleteBusIncharge,
} = require("../../controllers/busInchargeMaster.controller");

// Validators.
const {
    createBusInchargeSchema
} = require("../../validators/busInchargeMaster.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const { idParam } = require("../../validators/common.validator");

router.get(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
    getAllBusIncharge
);

router.get(
    "/get-attendant-type",
    [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
    getAttendantType
);

router.post(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([createBusInchargeSchema], [BODY])],
    createBusIncharge
);

router.put(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createBusInchargeSchema], [PARAMS, BODY])],
    updateBusIncharge
);

router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deleteBusIncharge
);

module.exports = router;
