const Joi = require("joi");

const syncDataSchema = Joi.object().keys({
  optype: Joi.string().required(),
  mobileNumber: Joi.string().length(10).required(),
  IMEINumber: Joi.string().required(),
  sNo: Joi.string().optional(),
  app_version: Joi.string().required(),
  oSType: Joi.string().required(),
});

const fetchConfigSchema = Joi.object().keys({
  optype: Joi.string().required(),
  sNo: Joi.string().required(),
  studentID: Joi.string().required(),
  busOperatorID: Joi.string().required(),
  schoolID: Joi.string().required(),
});

const mapScreenSchema = Joi.object().keys({
  routeID: Joi.string().required(),
  busOperatorID: Joi.string().required(),
  date: Joi.string().required(),
  type: Joi.string().required(),
  studentID: Joi.string().required(),
  app_version: Joi.string().required(),
  oSType: Joi.string().required(),
});

const checkOnGoingTripSchema = Joi.object().keys({
  routeID: Joi.string().required(),
  busOperatorID: Joi.string().required(),
  date: Joi.string().required(),
  type: Joi.string().required(),
  studentID: Joi.string().required(),
  sNo: Joi.string().required(),
  app_version: Joi.string().required(),
  osType: Joi.string().required(),
});

const getEventsSchema = Joi.object().keys({
  mobileNumber: Joi.string().required(),
  SNo: Joi.string().required(),
});

const noSchoolFoundSchema = Joi.object().keys({
  // optype: Joi.string().required(),
  SNo: Joi.string().required(),
  sName: Joi.string().required(),
  sAddress: Joi.string().required(),
  sPhone: Joi.string().required(),
  sCountry: Joi.string().required(),
  sCity: Joi.string().required(),
  rName: Joi.string().required(),
  rPhone: Joi.string().required(),
  sBusOperatorName: Joi.string().required(),
  sBusOperatorPhone: Joi.string().required(),
});

const checkOperatorAvailableOrNotSchema = Joi.object().keys({
  checkFor: Joi.string().required(),
  busOperatorID: Joi.string().required(),
});

const insertStoppageSchema = Joi.object().keys({
  insertStoppageApp: Joi.string().required(),
  schoolID: Joi.number().required(),
  busOperatorID: Joi.number().required(),
  stopageName: Joi.string().required(),
  countryID: Joi.number().required(),
  address1: Joi.string().required(),
  address2: Joi.string().optional(),
  cityID: Joi.number().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  isDeleted: Joi.string().required(),
  createdBy: Joi.string().required(),
  createdOn: Joi.string().required(),
});

const getFileSchema = Joi.object().keys({
  fileName: Joi.string().required(),
  app: Joi.string().required(),
});

const getStudentDetailsSchema = Joi.object().keys({
  dataForStudentID: Joi.string().required(),
});

const editStudentSchema = Joi.object().keys({
  busOperatorID: Joi.string().required(),
  fatherName: Joi.string().optional().allow(""),
  motherName: Joi.string().optional().allow(""),
  schoolID: Joi.string().required(),
  schoolSection: Joi.string().optional().allow(""),
  studentName: Joi.string().required(),
  studentNameHindi: Joi.string().optional().allow(""),
  studentBloodGroup: Joi.string().required(),
  studentStandard: Joi.string().required(),
  studentClass: Joi.string().optional().allow(""),
  countryID: Joi.string().required(),
  address1: Joi.string().optional().allow(""),
  address2: Joi.string().optional().allow(""),
  cityID: Joi.string().required(),
  pincode: Joi.string().optional().allow(""),
  fatherMobileNumber: Joi.string().optional().allow(""),
  motherMobileNumber: Joi.string().optional().allow(""),
  otherMobileNumber: Joi.string().optional().allow(""),
  primaryMobileNumberOf: Joi.string().required(),
  pickupMonday: Joi.string().optional().allow(""),
  pickupTuesday: Joi.string().optional().allow(""),
  pickupWednesday: Joi.string().optional().allow(""),
  pickupThursday: Joi.string().optional().allow(""),
  pickupFriday: Joi.string().optional().allow(""),
  pickupSaturday: Joi.string().optional().allow(""),
  pickupSunday: Joi.string().optional().allow(""),
  dropMonday: Joi.string().optional().allow(""),
  dropTuesday: Joi.string().optional().allow(""),
  dropWednesday: Joi.string().optional().allow(""),
  dropThursday: Joi.string().optional().allow(""),
  dropFriday: Joi.string().optional().allow(""),
  dropSaturday: Joi.string().optional().allow(""),
  dropSunday: Joi.string().optional().allow(""),
  stayBackToRouteID: Joi.string().optional().allow(""),
  stayBackDropMonday: Joi.string().optional().allow(""),
  stayBackDropTuesday: Joi.string().optional().allow(""),
  stayBackDropWednesday: Joi.string().optional().allow(""),
  stayBackDropThursday: Joi.string().optional().allow(""),
  stayBackDropFriday: Joi.string().optional().allow(""),
  stayBackDropSaturday: Joi.string().optional().allow(""),
  stayBackDropSunday: Joi.string().optional().allow(""),
  isAttendance: Joi.string().required(),
  emailID: Joi.string().optional().allow(""),
  fromRouteID: Joi.string().optional().allow(""),
  toRouteID: Joi.string().optional().allow(""),
  fromStoppageID: Joi.string().optional().allow(""),
  toStoppageID: Joi.string().optional().allow(""),
  studentID: Joi.string().required(),
  updatedBy: Joi.string().required(),
  updatedOn: Joi.string().required(),
});

const getCountriesSchema = Joi.object().keys({
  retrieve: Joi.string().required(),
});

const getCitySchema = Joi.object().keys({
  retrieve: Joi.string().required(),
  countryID: Joi.string().required(),
});

const getSchoolByCountrySchema = Joi.object().keys({
  retrieve: Joi.string().required(),
  cityName: Joi.string().required(),
  sNo: Joi.string().required(),
});

const inAppNotificationSchema = Joi.object().keys({
  optype: Joi.string().required(),
  mobileNumber: Joi.string().required(),
});

const checkEtaSchema = Joi.object().keys({
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  key: Joi.string().required(),
});

const deleteAccountSchema = Joi.object().keys({
  mobileNumber: Joi.string().length(10).required(),
});


const insertStudentSchema = Joi.object().keys({
  busOperatorID: Joi.number().required(),
  fatherName: Joi.string().optional().allow(""),
  motherName: Joi.string().optional().allow(""),
  schoolID: Joi.number().required(),
  schoolSection: Joi.string().optional().allow(""),
  studentName: Joi.string().required(),
  studentStandard: Joi.string().required(),
  studentClass: Joi.string().optional().allow(""),
  countryID: Joi.number().required(),
  address1: Joi.string().optional().allow(""),
  address2: Joi.string().optional().allow(""),
  cityID: Joi.number().required(),
  pincode: Joi.number().optional().allow(""),
  fatherMobileNumber: Joi.string().optional().allow(""),
  motherMobileNumber: Joi.string().optional().allow(""),
  otherMobileNumber: Joi.string().optional().allow(""),
  primaryMobileNumberOf: Joi.string().required(),
  emailID: Joi.string().optional().allow(""),
  fromRouteID: Joi.number().optional().allow(""),
  toRouteID: Joi.number().optional().allow(""),
  fromStoppageID: Joi.number().optional().allow(""),
  toStoppageID: Joi.number().optional().allow(""),
  createdBy: Joi.string().required(),
  createdOn: Joi.string().required(),
  isBan: Joi.string().required(),
  flag: Joi.string().required(),
  sKey: Joi.string().required(),
});

const cityForSignUpFirstSchema = Joi.object().keys({
  retrieve: Joi.string().required(),
  countryID: Joi.string().required(),
});

const getSchoolsForDropdownSchema = Joi.object().keys({
  retrieve: Joi.string().required(),
  busOperatorID: Joi.string().required(),
});

const getSchoolRoutesStoppagesSchema = Joi.object().keys({
  retrieve: Joi.string().required(),
  busOperatorID: Joi.string().required(),
  schoolID: Joi.string().required(),
});

const getStudentInfoSchema = Joi.object().keys({
  retrieve: Joi.string().required(),
  mobileNumber: Joi.string().required(),
});

const getCheckTripStartedOrNoSchema = Joi.object().keys({
  optype: Joi.string().required(),
  routeID: Joi.string().required(),
  busOperatorID: Joi.string().required(),
  date: Joi.string().required(),
  type: Joi.string().required(),
  studentID: Joi.string().required(),
  sNo: Joi.string().required(),
});

const insertDateTypeSchema = Joi.object().keys({
  studentID: Joi.string().required(),
  dateTime: Joi.string().required(),
  fromDate: Joi.string().required(),
  fromType: Joi.string().required(),
  toDate: Joi.string().required(),
  toType: Joi.string().required(),
});

const imageUploadSchema = Joi.object().keys({
  img: Joi.string().required(),
  source_type: Joi.string().valid('student_photo').required(),
  source_id: Joi.number().required(),
});

module.exports = {
  //   createSessionSchema,
  //   regenerateSessionSchema,
  //   updatePushTokenSchema,
  //   updateImeiTokenSchema,
  //   updateLoginInfoSchema,
  //   destroySessionSchema,
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
};
