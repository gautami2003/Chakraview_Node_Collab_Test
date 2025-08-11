const Joi = require("joi");

const createStoppageTimingSchema = Joi.object().keys({
    schoolID: Joi.string().required(),
    type: Joi.string().required(),
    routeID: Joi.string().required(),
    stoppageID: Joi.string().required(),
    stoppageTimeHour: Joi.string().required(),
    stoppageTimeMinute: Joi.string().required(),
    stoppageTimeAMPM: Joi.string().required(),
});

module.exports = {
    createStoppageTimingSchema
};
