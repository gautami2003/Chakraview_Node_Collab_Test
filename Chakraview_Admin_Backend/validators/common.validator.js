const Joi = require('joi');
const { PATTERNS } = require('../constants/patterns.constant');

const mobileNumberObj = {
  MobileNumber: Joi.string().min(10).max(10).pattern(PATTERNS.PHONE_2.pattern).optional().messages({
    'string.pattern.base': PATTERNS.PHONE_2.message,
    'string.max': "Mobile number must be 10 digit numbers",
  }),
}

const mobileNumbersObj = {
  MobileNumbers: Joi.string().required(),
}

const idParam = Joi.object().keys({
  id: Joi.string().required(),
});

const passwordObj = {
  password: Joi.string().min(5).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
};

const schoolIdObj = {
  SchoolID: Joi.number().integer().required(),
}

const busOperatorIdObj = {
  BusOperatorID: Joi.number().integer().required(),
};

const routeIdObj = {
  RouteID: Joi.number().integer().required(),
}

const busIdObj = {
  BusID: Joi.number().integer().required(),
}

const studentIDObj = {
  StudentID: Joi.number().integer().required(),
}

const routeTypeObj = {
  Type: Joi.string().valid('Pickup', 'Drop').required(),
}

const actualRouteTypeObj = {
  RouteType: Joi.string().valid('Pickup', 'Drop').required(),
}

const driverRouteTransactionIDObj = {
  DriverRouteTransactionID: Joi.number().integer().required()
}

const dateTimeObj = {
  DateTime: Joi.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/).required()
}

const IMEIObj = {
  IMEI: Joi.number().integer().required()
}

const latitudeObj = {
  Latitude: Joi.number().required(),
};

const longitudeObj = {
  Longitude: Joi.number().required(),
};

const IMEINumberObj = {
  IMEINumber: Joi.string().required(),
};

const DriverIDObj = {
  DriverID: Joi.number().integer().required(),
};
const OSTypeObj = {
  OSType: Joi.string().required()
}
const OSVersionObj = {
  OSVersion: Joi.string().required()
}
const ModelObj = {
  Model: Joi.string().required()
}
const BrandObj = {
  Brand: Joi.string().required()
}
const TokenObj = {
  Token: Joi.string().required(),
}
const snoObj = {
  sno: Joi.string().required(),
}
module.exports = {
  mobileNumberObj,
  idParam,
  passwordObj,
  schoolIdObj,
  busOperatorIdObj,
  routeIdObj,
  busIdObj,
  studentIDObj,
  routeTypeObj,
  driverRouteTransactionIDObj,
  dateTimeObj,
  IMEIObj,
  latitudeObj,
  longitudeObj,
  IMEINumberObj,
  DriverIDObj,
  mobileNumbersObj,
  actualRouteTypeObj,
  OSTypeObj,
  OSVersionObj,
  ModelObj,
  BrandObj,
  TokenObj,
  snoObj
};