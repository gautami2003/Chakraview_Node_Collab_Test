const express = require("express");
const router = express.Router();

// Middlewares
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");

// Validators.
const {
  loginSchema,
  signupSchema,
  forgotUsernamepPasswordSchema,
  resetPasswordSchema,
  studentLoginSchema,
  studentSignupSchema,
  studentLoginGenerateOTPSchema,
  launchUserSchema
} = require("../../validators/auth.validator");

// Constants.
const { BODY, PARAMS, QUERY, } = require("../../constants/request-properties.constant");

// Controllers.
const {
  login,
  logout,
  signup,
  forgotUsernamepPassword,
  resetPassword,
  studentlogin,
  studentlogout,
  studentSignup,
  studentLoginGenerateOTP,
  launchUser,
} = require("../../controllers/auth.controller");

router.post("/login", requestValidatorMiddleware([loginSchema], [BODY]), login);

router.post("/signup", requestValidatorMiddleware([signupSchema], [BODY]), signup);

router.post("/forgot-username-password", requestValidatorMiddleware([forgotUsernamepPasswordSchema], [BODY]), forgotUsernamepPassword);

router.post("/reset-password", requestValidatorMiddleware([resetPasswordSchema], [BODY]), resetPassword);

router.post(
  "/logout", jwtValidatorMiddleware, logout);

router.post("/student-login", requestValidatorMiddleware([studentLoginSchema], [BODY]), studentlogin);

router.post("/student-logout", jwtValidatorMiddleware, studentlogout);

router.post("/student-signup", requestValidatorMiddleware([studentSignupSchema], [BODY]), studentSignup);

router.post(
  "/student-login-generate-otp",
  [requestValidatorMiddleware([studentLoginGenerateOTPSchema], [BODY])],
  studentLoginGenerateOTP
);

router.post("/launch-user", requestValidatorMiddleware([launchUserSchema], [BODY]), launchUser);

module.exports = router;
