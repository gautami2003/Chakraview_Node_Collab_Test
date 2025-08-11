const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    getBusOperator,
    getBusOperatorNameList,
    getBusSingal,
    getProfile,
    editProfile,
    getSummary,
    getConfigurations,
    updateConfigurations,
    updateBusOperator,
    deleteBusOperator,
} = require("../../controllers/busOperator.controller");

// Validators.
const {
    getBusOperatorSchema,
    editProfileSchema,
    getConfigurationsSchema,
    updateConfigurationsSchema,
    updateBusOperatorSchema,
} = require("../../validators/busOperator.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const { idParam } = require("../../validators/common.validator");

router.get(
    "/get-all",
    [jwtValidatorMiddleware, requestValidatorMiddleware([getBusOperatorSchema], [QUERY])],
    getBusOperator
);

router.get(
    "/name-list",
    jwtValidatorMiddleware,
    getBusOperatorNameList
);

router.get(
    "/summary/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    getSummary
);
router.get(
    "/get-profile",
    jwtValidatorMiddleware,
    getProfile
);

router.get(
    '/:id',
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    getBusSingal
);


router.put(
    "/edit-profile",
    [jwtValidatorMiddleware, requestValidatorMiddleware([editProfileSchema], [BODY])],
    editProfile
);

router.patch(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, updateBusOperatorSchema], [PARAMS, BODY])],
    updateBusOperator
);


router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deleteBusOperator
);

router.get(
    "/configurations/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, getConfigurationsSchema], [PARAMS, QUERY])],
    getConfigurations
);

router.patch(
    "/configurations/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, updateConfigurationsSchema], [PARAMS, BODY])],
    updateConfigurations
);

module.exports = router;
