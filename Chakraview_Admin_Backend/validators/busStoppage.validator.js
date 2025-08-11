const Joi = require("joi");

const createBusStoppageSchema = Joi.object().keys({
    stopageName: Joi.string().required(),
    location: Joi.string().required(),
    countryID: Joi.string().required(),
    address1: Joi.string().optional().allow(""),
    address2: Joi.string().optional().allow(""),
    cityID: Joi.string().required(),
    pincode: Joi.string().optional().allow(""),
    latitude: Joi.string().optional().allow(""),
    longitude: Joi.string().optional().allow(""),
});

module.exports = {
    createBusStoppageSchema
};
