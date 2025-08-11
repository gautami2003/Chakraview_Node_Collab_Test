const Joi = require("joi");

const createBusInchargeSchema = Joi.object().keys({
    driverName: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    secondaryMobileNumber: Joi.string().optional().allow(""),
    attendantTypeID: Joi.string().required(),
    drivingLicenseNumber: Joi.string().optional().allow(""),
    drivingLicenseImage: Joi.string().optional().allow(""),
});

module.exports = {
    createBusInchargeSchema
};
