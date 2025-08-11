const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    getMDMDevices,
    getDevicesNameList,
    createMdmDevices,
    updateMdmDevices,
    deleteMdmDevices,
} = require("../../controllers/mdmDevices.controller");

// Validators.
const {
    createMdmDevicesSchema,
} = require("../../validators/mdmDevices.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const { idParam } = require("../../validators/common.validator");

router.get(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
    getMDMDevices
);

router.get(
    "/name-list",
    jwtValidatorMiddleware,
    getDevicesNameList
);

router.post(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([createMdmDevicesSchema], [BODY])],
    createMdmDevices
);

router.put(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createMdmDevicesSchema], [PARAMS, BODY])],
    updateMdmDevices
);

router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deleteMdmDevices
);

module.exports = router;
