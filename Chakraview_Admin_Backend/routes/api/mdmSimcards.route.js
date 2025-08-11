const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    MDMSimcards,
    getSimcardsList,
    simcardsFilter,
    createMdmSimcards,
    deleteMdmSimcards,
    updateMdmSimcards,
} = require("../../controllers/mdmSimcards.controller");

// Validators.
const {
    simcardsFilterSchema,
    createMdmSimcardsSchema,
} = require("../../validators/mdmSimcards.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const { idParam } = require("../../validators/common.validator");


router.get(
    "/",
    jwtValidatorMiddleware,
    MDMSimcards
);

router.get(
    "/name-list",
    jwtValidatorMiddleware,
    getSimcardsList
);

router.get(
    "/simcards-filter",
    [jwtValidatorMiddleware, requestValidatorMiddleware([simcardsFilterSchema], [QUERY])],
    simcardsFilter
);

router.post(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([createMdmSimcardsSchema], [BODY])],
    createMdmSimcards
);

router.put(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createMdmSimcardsSchema], [PARAMS, BODY])],
    updateMdmSimcards
);

router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deleteMdmSimcards
);

module.exports = router;
