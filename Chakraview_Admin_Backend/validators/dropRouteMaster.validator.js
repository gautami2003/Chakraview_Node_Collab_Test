const Joi = require("joi");

const createDropRouteSchema = Joi.object().keys({
    schoolID: Joi.string().required(),
    routeName: Joi.string().required(),
    busName: Joi.string().optional().allow(""),
    driverID: Joi.string().optional().allow(""),
    startLocation: Joi.string().optional().allow(""),
    destinationLocation: Joi.string().optional().allow(""),
    startTimeHour: Joi.string().optional().allow(""),
    startTimeMinute: Joi.string().optional().allow(""),
    startTimeAMPM: Joi.string().optional().allow(""),
    endTimeHour: Joi.string().optional().allow(""),
    endTimeMinute: Joi.string().optional().allow(""),
    endTimeAMPM: Joi.string().optional().allow(""),
    idealKMS: Joi.string().optional().allow(""),
});

module.exports = {
    createDropRouteSchema
};
