const Joi = require("joi");

const getGpsDataSchema = Joi.object().keys({
    mobileNumber: Joi.string().required(),
});


module.exports = {
    getGpsDataSchema
};
