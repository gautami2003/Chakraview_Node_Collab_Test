const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
  syncData,
  fetchConfig,
  mapScreen,
  checkOnGoingTrip,
  getEvents,
  noSchoolFound,
  checkOperatorAvailableOrNot,
  insertStoppage,
  getFile,
  getStudentDetails,
  editStudent,
  getCountries,
  getCity,
  getSchoolByCountry,
  inAppNotification,
  checkEta,
  deleteAccount,
  insertStudent,
  cityForSignUpFirst,
  getSchoolsForDropdown,
  getSchoolRoutesStoppages,
  getStudentInfo,
  getCheckTripStartedOrNo,
  insertDateType,
  imageUpload,
  // createSession,
  // regenerateSession,
  // updatePushToken,
  // updateImeiToken,
  // updateLoginInfo,
  // destroySession,
} = require("../../controllers/parent.controller");

// Validators.
const {
  syncDataSchema,
  fetchConfigSchema,
  mapScreenSchema,
  checkOnGoingTripSchema,
  getEventsSchema,
  noSchoolFoundSchema,
  checkOperatorAvailableOrNotSchema,
  insertStoppageSchema,
  getFileSchema,
  getStudentDetailsSchema,
  editStudentSchema,
  getCountriesSchema,
  getCitySchema,
  getSchoolByCountrySchema,
  inAppNotificationSchema,
  checkEtaSchema,
  deleteAccountSchema,
  insertStudentSchema,
  cityForSignUpFirstSchema,
  getSchoolsForDropdownSchema,
  getSchoolRoutesStoppagesSchema,
  getStudentInfoSchema,
  getCheckTripStartedOrNoSchema,
  insertDateTypeSchema,
  imageUploadSchema,
  // createSessionSchema,
  // regenerateSessionSchema,
  // updatePushTokenSchema,
  // updateImeiTokenSchema,
  // updateLoginInfoSchema,
  // destroySessionSchema
} = require("../../validators/parent.validator");

// Middlewares.
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");

router.get(
  "/sync-data",
  [jwtValidatorMiddleware, requestValidatorMiddleware([syncDataSchema], [QUERY])],
  syncData
);

router.get(
  "/fetch-config",
  [jwtValidatorMiddleware, requestValidatorMiddleware([fetchConfigSchema], [QUERY])],
  fetchConfig
);

router.get(
  "/map-screen",
  [jwtValidatorMiddleware, requestValidatorMiddleware([mapScreenSchema], [QUERY])],
  mapScreen
);

router.get(
  "/check-on-going-trip",
  [jwtValidatorMiddleware, requestValidatorMiddleware([checkOnGoingTripSchema], [QUERY])],
  checkOnGoingTrip
);

router.get(
  "/get-events",
  [jwtValidatorMiddleware, requestValidatorMiddleware([getEventsSchema], [QUERY])],
  getEvents
);

router.post(
  "/no-school-found",
  [requestValidatorMiddleware([noSchoolFoundSchema], [BODY])],
  noSchoolFound
);

router.get(
  "/check-operator-available-ornot",
  [requestValidatorMiddleware([checkOperatorAvailableOrNotSchema], [QUERY])],
  checkOperatorAvailableOrNot
);

router.post(
  "/insert-stoppage",
  [requestValidatorMiddleware([insertStoppageSchema], [BODY])],
  insertStoppage
);

router.get(
  "/get-file",
  [requestValidatorMiddleware([getFileSchema], [QUERY])],
  getFile
);

router.get(
  "/get-student-details",
  [jwtValidatorMiddleware, requestValidatorMiddleware([getStudentDetailsSchema], [QUERY])],
  getStudentDetails
);

router.put(
  "/edit-student",
  [jwtValidatorMiddleware, requestValidatorMiddleware([editStudentSchema], [BODY])],
  editStudent
);

router.get(
  "/get-countries",
  [requestValidatorMiddleware([getCountriesSchema], [QUERY])],
  getCountries
);

router.get(
  "/get-city",
  [requestValidatorMiddleware([getCitySchema], [QUERY])],
  getCity
);

router.get(
  "/get-school-by-country&city",
  [requestValidatorMiddleware([getSchoolByCountrySchema], [QUERY])],
  getSchoolByCountry
);

router.get(
  "/in-app-notification",
  [jwtValidatorMiddleware, requestValidatorMiddleware([inAppNotificationSchema], [QUERY])],
  inAppNotification
);

router.get(
  "/check-eta",
  [jwtValidatorMiddleware, requestValidatorMiddleware([checkEtaSchema], [QUERY])],
  checkEta
);

router.delete(
  "/delete-account",
  [jwtValidatorMiddleware, requestValidatorMiddleware([deleteAccountSchema], [BODY])],
  deleteAccount
);

router.post(
  "/insert-student",
  [requestValidatorMiddleware([insertStudentSchema], [BODY])],
  insertStudent
);

router.get(
  "/city-for-signup-first",
  [jwtValidatorMiddleware, requestValidatorMiddleware([cityForSignUpFirstSchema], [QUERY])],
  cityForSignUpFirst
);

router.get(
  "/get-schools-for-dropdown",
  [requestValidatorMiddleware([getSchoolsForDropdownSchema], [QUERY])],
  getSchoolsForDropdown
);

router.get(
  "/get-school-routes-stoppages",
  [requestValidatorMiddleware([getSchoolRoutesStoppagesSchema], [QUERY])],
  getSchoolRoutesStoppages
);

router.get(
  "/get-student-info",
  [jwtValidatorMiddleware, requestValidatorMiddleware([getStudentInfoSchema], [QUERY])],
  getStudentInfo
);

router.get(
  "/get-check-trip-started-or-not",
  [jwtValidatorMiddleware, requestValidatorMiddleware([getCheckTripStartedOrNoSchema], [QUERY])],
  getCheckTripStartedOrNo
);

router.post(
  "/insert-date-type",
  [jwtValidatorMiddleware, requestValidatorMiddleware([insertDateTypeSchema], [BODY])],
  insertDateType
);

router.post(
  "/image-upload",
  [jwtValidatorMiddleware, requestValidatorMiddleware([imageUploadSchema], [BODY])],
  imageUpload
);

module.exports = router;
