const Joi = require("joi");

const getAllSchoolSchema = Joi.object().keys({
    busOperatorID: Joi.string().optional().allow(""),
});

const createSchoolSchema = Joi.object().keys({
    busOperatorID: Joi.string().optional().allow(""),
    schoolName: Joi.string().required(),
    countryID: Joi.string().required(),
    address1: Joi.string().required(),
    address2: Joi.string().optional().allow(""),
    cityID: Joi.string().required(),
    pincode: Joi.string().optional().allow(""),
    prePrimarySectionInchargeName: Joi.string().optional().allow(""),
    prePrimarySectionInchargeNumber: Joi.string().optional().allow(""),
    primarySectionInchargeName: Joi.string().optional().allow(""),
    primarySectionInchargeNumber: Joi.string().optional().allow(""),
    secondarySectionInchargeName: Joi.string().optional().allow(""),
    secondarySectionInchargeNumber: Joi.string().optional().allow(""),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    schoolLogo: Joi.string().optional().allow(""),
});

const schoolFeesDiscountsSchema = Joi.object().keys({
    schoolID: Joi.string().optional(),
    routeType: Joi.string().optional()
});

module.exports = {
    getAllSchoolSchema,
    createSchoolSchema,
    schoolFeesDiscountsSchema
};
