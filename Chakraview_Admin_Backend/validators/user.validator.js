const Joi = require("joi");

const updateUserSchema = Joi.object().keys({
    emailID: Joi.string().required(),
    userName: Joi.string().required()

});

module.exports = {
    updateUserSchema
};
