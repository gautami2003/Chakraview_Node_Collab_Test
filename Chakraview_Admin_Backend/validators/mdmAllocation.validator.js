const Joi = require("joi");

const createMdmAllocatioSchema = Joi.object().keys({
    deviceSerialNumber: Joi.number().required(),
    simSerialNumber: Joi.number().required(),
    school: Joi.string().optional().allow(""),
    routeNumber: Joi.string().optional().allow(""),
    attendant: Joi.string().optional().allow(""),
    deviceSubmitDate: Joi.string().optional().allow(""),
    device_Submit_Person: Joi.string().optional().allow(""),
});

const deleteAccountSchema = Joi.object().keys({
    id: Joi.string().required(),
});

module.exports = {
    deleteAccountSchema,
    createMdmAllocatioSchema,
};
