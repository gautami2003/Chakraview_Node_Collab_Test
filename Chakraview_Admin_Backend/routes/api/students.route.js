const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    getAllStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    studentFeesUpdate,
    getStudentListByNo,
    getStudentPayFeeszon
} = require("../../controllers/student.controller");

// Validators.
const {
    createStudentSchema,
    getStudentPayFeeszonSchema
} = require("../../validators/student.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const { idParam } = require("../../validators/common.validator");

router.get(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([], [])],
    getAllStudent
);

router.get("/student-list-by-no", jwtValidatorMiddleware, getStudentListByNo);

router.get("/student-pay-feeszon",
    [jwtValidatorMiddleware, requestValidatorMiddleware([getStudentPayFeeszonSchema], [QUERY])],
    getStudentPayFeeszon
);

router.post(
    "/",
    [jwtValidatorMiddleware, requestValidatorMiddleware([createStudentSchema], [BODY])],
    createStudent
);

router.patch(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createStudentSchema], [PARAMS, BODY])],
    updateStudent
);

router.patch(
    "/update/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createStudentSchema], [PARAMS, BODY])],
    studentFeesUpdate
);


router.delete(
    "/:id",
    [jwtValidatorMiddleware, requestValidatorMiddleware([idParam], [PARAMS])],
    deleteStudent
);

module.exports = router;
