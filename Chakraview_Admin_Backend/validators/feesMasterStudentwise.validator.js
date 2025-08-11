const Joi = require("joi");

const installmentSchema = Joi.object().keys({
    first: Joi.number().optional(),
    second: Joi.number().optional(),
    third: Joi.number().optional(),
    fourth: Joi.number().optional(),
    dueDate: Joi.date().required()
});

const createFeesMasterStudentwiseSchema = Joi.object().keys({
    SchoolID: Joi.number().required(),
    StudentID: Joi.number().required(),
    SchoolCode: Joi.string().required(),
    ChakraviewCode: Joi.string().optional(),
    AddressZone: Joi.string().optional(),
    Currency: Joi.string().valid("INR"),
    TotalFees: Joi.number().required(),
    installments: Joi.array().items(installmentSchema).max(4)
});

module.exports = {
    createFeesMasterStudentwiseSchema
};