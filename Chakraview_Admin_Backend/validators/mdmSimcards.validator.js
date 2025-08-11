const Joi = require("joi");

const simcardsFilterSchema = Joi.object().keys({
    simType: Joi.string().required(),
});

const createMdmSimcardsSchema = Joi.object().keys({
    simSerialNumber: Joi.string().optional().allow(""),
    networkProvider: Joi.string().optional().allow(""),
    simType: Joi.string().optional().allow(""),
    rechargeType: Joi.string().optional().allow(""),
    phoneNumber: Joi.string().required(),
    sIMNumber: Joi.string().optional().allow(""),
    sIMPurchaseDate: Joi.string().optional().allow(""),
    postpaidPlanName: Joi.string().optional().allow(""),
    postpaidPlanRental: Joi.string().optional().allow(""),
    prepaidPlanName: Joi.string().optional().allow(""),
    prepaidRechargeDate: Joi.string().optional().allow(""),
    prepaidRechargeAmount: Joi.string().optional().allow(""),
    simStatus: Joi.string().optional().allow(""),
    custID: Joi.string().optional().allow(""),
});


module.exports = {
    simcardsFilterSchema,
    createMdmSimcardsSchema,
};
