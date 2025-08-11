const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant.js");

// Controller methods.
const {
    getFeesMasterZonewise,
    createFeesMasterZonewise,
    updateFeesMasterZonewise,
    deletefeesMasterZonewise,
    getAddressZone,
    getPaymentFrequency,
    paymentFrequencyDropDown
} = require("../../controllers/feesMasterZonewise.controller.js");

// Validators.
const {
    createFeesMasterZonewiseSchema,
    addressZoneSchema,
    paymentFrequencySchema,
    paymentFrequencyDropDownSchema
} = require("../../validators/feesMasterZonewise.validator.js");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware.js");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware.js");
const { idParam } = require("../../validators/common.validator.js");

router.get(
    "/",
    jwtValidatorMiddleware,
    getFeesMasterZonewise
);

router.post(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([createFeesMasterZonewiseSchema], [BODY])],
    createFeesMasterZonewise
);

router.put(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createFeesMasterZonewiseSchema], [PARAMS, BODY])],
    updateFeesMasterZonewise
);

router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deletefeesMasterZonewise
);

router.get(
    "/get-addresszone",
    [jwtValidatorMiddleware, requestValidatorMiddleware([addressZoneSchema], [QUERY])],
    getAddressZone
);

router.get(
    "/payment-frequency-dropdown",
    [jwtValidatorMiddleware, requestValidatorMiddleware([paymentFrequencyDropDownSchema], [QUERY])],
    paymentFrequencyDropDown
);

router.get(
    "/get-payment-frequency",
    [jwtValidatorMiddleware, requestValidatorMiddleware([paymentFrequencySchema], [QUERY])],
    getPaymentFrequency
);

module.exports = router;
