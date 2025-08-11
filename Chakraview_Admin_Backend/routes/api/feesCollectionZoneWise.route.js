const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant.js");

// Controller methods.
const {
    getFeesCollectionZoneWise,
    createFeesCollectionZoneWise,
    updateFeesCollectionZoneWise,
    deleteFeesCollectionZoneWise,
} = require("../../controllers/feesCollectionZoneWise.controller.js");

// Validators.
const {
    createFeesCollectionZoneWiseSchema, updateFeesCollectionZoneWiseSchema
} = require("../../validators/feesCollectionZoneWise.validator.js");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware.js");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware.js");
const { idParam } = require("../../validators/common.validator.js");

router.get(
    "/",
    jwtValidatorMiddleware,
    getFeesCollectionZoneWise
);

router.post(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([createFeesCollectionZoneWiseSchema], [BODY])],
    createFeesCollectionZoneWise
);

router.put(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, updateFeesCollectionZoneWiseSchema], [PARAMS, BODY])],
    updateFeesCollectionZoneWise
);

router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deleteFeesCollectionZoneWise
);

module.exports = router;
