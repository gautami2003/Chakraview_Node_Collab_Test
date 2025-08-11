const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant.js");

// Controller methods.
const {
    getFeesMasterStudentwise,
    createFeesMasterStudentwise,
    updateFeesMasterStudentwise,
    deleteFeesMasterStudentwise,
} = require("../../controllers/feesMasterStudentwise.controller.js");

// Validators.
const {
    createFeesMasterStudentwiseSchema,
} = require("../../validators/feesMasterStudentwise.validator.js");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware.js");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware.js");
const { idParam } = require("../../validators/common.validator.js");

router.get(
    "/",
    jwtValidatorMiddleware,
    getFeesMasterStudentwise
);

router.post(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([createFeesMasterStudentwiseSchema], [BODY])],
    createFeesMasterStudentwise
);

router.put(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createFeesMasterStudentwiseSchema], [PARAMS, BODY])],
    updateFeesMasterStudentwise
);

router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deleteFeesMasterStudentwise
);

module.exports = router;
