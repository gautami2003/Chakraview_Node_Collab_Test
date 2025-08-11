const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    getAllDropRoute,
    createDropRoute,
    updateDropRoute,
    deleteDropRoute,
} = require("../../controllers/dropRouteMaster.controller");

// Validators.
const {
    createDropRouteSchema
} = require("../../validators/dropRouteMaster.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const { idParam } = require("../../validators/common.validator");

router.get(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
    getAllDropRoute
);

router.post(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([createDropRouteSchema], [BODY])],
    createDropRoute
);

router.put(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createDropRouteSchema], [PARAMS, BODY])],
    updateDropRoute
);

router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deleteDropRoute
);

module.exports = router;
