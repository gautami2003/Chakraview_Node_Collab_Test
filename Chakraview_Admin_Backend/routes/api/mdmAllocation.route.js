const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    getMDMAllocation,
    getAllocationList,
    createMdmAllocatio,
    updateMdmAllocatio,
    deleteMdmAllocation,
} = require("../../controllers/mdmAllocation.controller");

// Validators.
const {
    createMdmAllocatioSchema
} = require("../../validators/mdmAllocation.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const { idParam } = require("../../validators/common.validator");

router.get(
    "/",
    jwtValidatorMiddleware,
    getMDMAllocation
);

router.get(
    "/name-list",
    jwtValidatorMiddleware,
    getAllocationList
);


router.post(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([createMdmAllocatioSchema], [BODY])],
    createMdmAllocatio
);

router.put(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createMdmAllocatioSchema], [PARAMS, BODY])],
    updateMdmAllocatio
);

router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deleteMdmAllocation
);

module.exports = router;
