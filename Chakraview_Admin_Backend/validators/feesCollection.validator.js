const Joi = require("joi");

const createFeesCollectionSchema = Joi.object().keys({
    FeesID: Joi.number().required(),
    SchoolCode: Joi.string().required(),
    InstallmentName: Joi.string().optional(),
    PaidAmount: Joi.number().required(),
    PaymentDate: Joi.date().required(),
    ModeOfPayment: Joi.string().optional(),
    CheckOrRefNumber: Joi.string().optional(),
    NameOfBank: Joi.string().optional(),
    Remarks: Joi.string().optional(),
    EmailIDForPayment: Joi.string().email().optional(),
    HasRequestedToPG: Joi.string().optional(),
    StatusFromPG: Joi.string().empty("").optional(),
    TxnIDFromPG: Joi.string().empty("").optional(),
    isDeleted: Joi.string().optional(),
    CreatedBy: Joi.string().optional(),
    CreatedOn: Joi.date().optional(),
});

const deleteFeesCollectionSchema = Joi.object().keys({
    id: Joi.number().required(),
});

module.exports = {
    createFeesCollectionSchema,
    deleteFeesCollectionSchema
};
