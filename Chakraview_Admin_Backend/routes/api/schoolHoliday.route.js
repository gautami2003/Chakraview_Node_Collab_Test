const express = require('express');
const router = express.Router();
const { BODY, PARAMS } = require("../../constants/request-properties.constant");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");

// validators
const { createSchoolHolidaySchema, getSingleHolidaySchema, deleteSchoolHolidaySchema } = require('../../validators/schoolHoliday.validator');
const { idParam } = require('../../validators/common.validator');

// controller
const { createSchoolHoliday, getAllSchoolHoliday, getSingleSchoolHoliday, deleteSchoolHoliday, updateSchoolHoliday } = require('../../controllers/SchoolHoliday.controller');


router.post('/',
    jwtValidatorMiddleware,
    requestValidatorMiddleware([createSchoolHolidaySchema], [BODY]),
    createSchoolHoliday);

router.get('/',
    jwtValidatorMiddleware, getAllSchoolHoliday);

router.get('/:id',
    jwtValidatorMiddleware, requestValidatorMiddleware([getSingleHolidaySchema], [PARAMS]),
    getSingleSchoolHoliday);

router.delete('/:id',
    jwtValidatorMiddleware, requestValidatorMiddleware([deleteSchoolHolidaySchema], [PARAMS]),
    deleteSchoolHoliday);

router.put('/:id',
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createSchoolHolidaySchema], [PARAMS, BODY])],
    updateSchoolHoliday);

module.exports = router;

