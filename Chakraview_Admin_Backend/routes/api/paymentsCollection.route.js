const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const { ccaInitiatePayment, ccaPaymentResponse, ccaPaymentCancel, ccaCallback } = require("../../controllers/paymentsCollection.controller");

// Validators.
const { ccaInitialPaymentSchema, ccaPaymentResponseSchema } = require("../../validators/paymentsCollection.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");

router.post(
    "/cca/initiate-payment",
    [jwtValidatorMiddleware, requestValidatorMiddleware([ccaInitialPaymentSchema], [BODY])],
    ccaInitiatePayment
);

router.post(
    "/cca/payment-response",
    // [jwtValidatorMiddleware, requestValidatorMiddleware([ccaPaymentResponseSchema], [BODY])],
    // [requestValidatorMiddleware([], [BODY])],
    ccaPaymentResponse
);

router.post(
    "/cca/payment-cancel",
    // [jwtValidatorMiddleware, requestValidatorMiddleware([ccaPaymentResponseSchema], [BODY])],
    // [requestValidatorMiddleware([], [BODY])],
    ccaPaymentCancel
);

router.get(
    "/cca/callback",
    jwtValidatorMiddleware,
    ccaCallback
);

module.exports = router;
