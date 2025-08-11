const Joi = require("joi");

const updateSchoolAndStandardSchema = Joi.object().keys({

    busOperatorID: Joi.string().optional(),
    schoolID: Joi.string().required(),
    routeType: Joi.string().optional(),
    schoolSection: Joi.string().empty('').optional(),
    studentStandard: Joi.string().optional(),
    createdOn: Joi.string().optional(),
    createdBy: Joi.string().optional(),
})

module.exports = {
    updateSchoolAndStandardSchema
}


