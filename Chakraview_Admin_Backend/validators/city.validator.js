const Joi = require("joi");

const getCitySchema = Joi.object().keys({
    id: Joi.string().required(),
});

module.exports = {
    getCitySchema,
};