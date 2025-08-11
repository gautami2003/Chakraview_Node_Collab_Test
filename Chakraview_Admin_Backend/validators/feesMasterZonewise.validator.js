const Joi = require("joi");

const createFeesMasterZonewiseSchema = Joi.object().keys({
    schoolID: Joi.number().required(),
    addressZone: Joi.string().required(),
    monthly_Period: Joi.string().optional().allow(""),
    quarterly_Period: Joi.string().optional().allow(""),
    annual_Period: Joi.string().optional().allow(""),
    semiAnnual_Period: Joi.string().optional().allow(""),
    quadrimester_Period: Joi.string().optional().allow(""),
    monthly_Amount: Joi.number().optional().allow(""),
    quarterly_Amount: Joi.number().optional().allow(""),
    annual_Amount: Joi.number().optional().allow(""),
    semiAnnual_Amount: Joi.number().optional().allow(""),
    quadrimester_Amount: Joi.number().optional().allow(""),
    duedateForPayment: Joi.string().optional().allow("")

});

const addressZoneSchema = Joi.object().keys({
    schoolID: Joi.number().required(),
});

const paymentFrequencyDropDownSchema = Joi.object().keys({
    schoolID: Joi.number().required(),
    addressZone: Joi.string().required(),
});

const paymentFrequencySchema = Joi.object().keys({
    schoolID: Joi.number().required(),
    addressZone: Joi.string().required(),
    type: Joi.string().required(),
    routeType: Joi.string().optional(),
    standard: Joi.string().optional(),
});


module.exports = {
    createFeesMasterZonewiseSchema,
    addressZoneSchema,
    paymentFrequencySchema,
    paymentFrequencyDropDownSchema
};
