const express = require("express");
const router = express.Router();
const { QUERY, BODY, PARAMS } = require("../../constants/request-properties.constant.js");
const { idParam } = require("../../validators/common.validator.js");

const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware.js");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware.js");
const { getSchoolsAndStandard, GetSchoolAndStd, updateSchoolandStandard } = require("../../controllers/configureDistanceSms.controller.js");
const { updateSchoolAndStandardSchema } = require("../../validators/configureDistanceSms.validator.js");

router.get(
    '/',
    jwtValidatorMiddleware,
    getSchoolsAndStandard
);

router.get(
    '/configure-school-student',
    jwtValidatorMiddleware,
    GetSchoolAndStd
)
router.put(
    "/:id",
    jwtValidatorMiddleware,
    requestValidatorMiddleware([idParam, updateSchoolAndStandardSchema], [PARAMS, BODY]),
    updateSchoolandStandard
);

module.exports = router;
