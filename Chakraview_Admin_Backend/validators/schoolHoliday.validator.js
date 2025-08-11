const { get } = require("http");
const Joi = require("joi");

const createSchoolHolidaySchema = Joi.object().keys({
    BusOperatorID: Joi.string().required(),
    SchoolID: Joi.string().required(),
    StartDate: Joi.string().optional(),
    EndDate: Joi.string().optional(),
    Event: Joi.string().required(),
    Type: Joi.string().optional(),
    Standard: Joi.string().optional(),
    CreatedBy: Joi.string().optional(),
    CreatedOn: Joi.string().optional(),
    UpdatedBy: Joi.string().optional(),
    UpdatedOn: Joi.string().optional(),
});

const getSingleHolidaySchema = Joi.object().keys({
    id: Joi.number().required()
});

const deleteSchoolHolidaySchema = Joi.object().keys({
    id: Joi.number().required(),

});


module.exports = {
    createSchoolHolidaySchema,
    getSingleHolidaySchema,
    deleteSchoolHolidaySchema

}