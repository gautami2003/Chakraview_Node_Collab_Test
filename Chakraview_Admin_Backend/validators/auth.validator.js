const Joi = require("joi");

// const { emailObj, passwordObj } = require('./common.validator');

const loginSchema = Joi.object().keys({
  userName: Joi.string().required(),
  password: Joi.string().required(),
});

const launchUserSchema = Joi.object().keys({
  userID: Joi.number().required(),
  busOperatorId: Joi.number().required(),
});

const signupSchema = Joi.object().keys({
  busOperatorName: Joi.string().required(),
  countryID: Joi.string().required(),
  address1: Joi.string().required(),
  address2: Joi.string().optional().allow(""),
  cityID: Joi.string().required(),
  pincode: Joi.string().required(),
  phoneNumber: Joi.string().optional().allow(""),
  ownerName: Joi.string().required(),
  ownerPhoneNumber: Joi.string().required(),
  emailID: Joi.string().required(),
  websiteURL: Joi.string().optional().allow(""),
  businessType: Joi.string().required(),
  userName: Joi.string().required(),
  password: Joi.string().optional().allow(""),
});

const forgotUsernamepPasswordSchema = Joi.object().keys({
  action: Joi.string().required(),
  emailID: Joi.string().required(),
});

const resetPasswordSchema = Joi.object().keys({
  userID: Joi.string().required(),
  password: Joi.string().required(),
  updatedBy: Joi.string().required(),
  updatedOn: Joi.string().required(),
});

const studentLoginSchema = Joi.object().keys({
  phoneNumber: Joi.string().length(10).required(),
  OTP: Joi.string().required(),
});

const studentSignupSchema = Joi.object().keys({
  busOperatorName: Joi.string().required(),
  countryID: Joi.string().required(),
  address1: Joi.string().required(),
  address2: Joi.string().optional().allow(""),
  cityID: Joi.string().required(),
  pincode: Joi.string().required(),
  phoneNumber: Joi.string().optional().allow(""),
  ownerName: Joi.string().required(),
  ownerPhoneNumber: Joi.string().required(),
  emailID: Joi.string().required(),
  websiteURL: Joi.string().optional().allow(""),
  businessType: Joi.string().required(),
  userName: Joi.string().required(),
  password: Joi.string().optional().allow(""),
});

const studentLoginGenerateOTPSchema = Joi.object().keys({
  phoneNumber: Joi.string().length(10).required(),
  sandbox: Joi.string().optional()
});


module.exports = {
  loginSchema,
  signupSchema,
  forgotUsernamepPasswordSchema,
  resetPasswordSchema,
  studentLoginSchema,
  studentSignupSchema,
  studentLoginGenerateOTPSchema,
  launchUserSchema
};
