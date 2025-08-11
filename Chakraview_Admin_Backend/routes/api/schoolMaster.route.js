const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    getAllSchool,
    getSchoolNameList,
    getSchoolHolidays,
    schoolFeesDiscounts,
    createSchool,
    updateSchool,
    deleteSchool,
} = require("../../controllers/schoolMaster.controller");

// Validators.
const {
    getAllSchoolSchema,
    createSchoolSchema,
    schoolFeesDiscountsSchema,
} = require("../../validators/schoolMaster.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const { idParam } = require("../../validators/common.validator");

router.get(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([getAllSchoolSchema], [PARAMS])],
    getAllSchool
);
router.get(
    "/name-list",
    jwtValidatorMiddleware,
    getSchoolNameList
);

router.get(
    "/school-holiday",
    jwtValidatorMiddleware,
    getSchoolHolidays
);

router.get(
    "/school-fees-discount",
    [jwtValidatorMiddleware, requestValidatorMiddleware([schoolFeesDiscountsSchema], [PARAMS])],
    schoolFeesDiscounts
);

router.post(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([createSchoolSchema], [BODY])],
    createSchool
);

router.put(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createSchoolSchema], [PARAMS, BODY])],
    updateSchool
);

router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deleteSchool
);

module.exports = router;
