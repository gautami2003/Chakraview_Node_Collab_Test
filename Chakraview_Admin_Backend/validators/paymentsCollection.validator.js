const Joi = require("joi");

const ccaInitialPaymentSchema = Joi.object().keys({
    studentID: Joi.string().required(),
    amount: Joi.number().required(),
    grossAmount: Joi.number().required(),
});

const ccaPaymentResponseSchema = Joi.object().keys({
    encResp: Joi.string().required()
});


module.exports = {
    ccaInitialPaymentSchema,
    ccaPaymentResponseSchema,
};
