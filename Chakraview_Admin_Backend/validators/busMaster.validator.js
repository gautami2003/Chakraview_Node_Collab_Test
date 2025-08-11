const Joi = require("joi");

const createBusSchema = Joi.object().keys({
    busName: Joi.string().required(),
    busSeats: Joi.string().required(),
    busRegistrationNumber: Joi.string().required(),
    busChasisNumber: Joi.string().optional().allow(""),
    busRegistrationDate: Joi.string().optional().allow(""),
    gPSDeviceIMEINo: Joi.string().optional().allow(""),
    gPSDeviceMobileNumber: Joi.string().optional().allow(""),
});


module.exports = {
    createBusSchema,
};
