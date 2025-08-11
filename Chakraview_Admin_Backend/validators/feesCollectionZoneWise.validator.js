const Joi = require("joi");

const createFeesCollectionZoneWiseSchema = Joi.object().keys({
    SchoolID: Joi.number().required(),
    SchoolName: Joi.string().required(),
    BusOperatorID: Joi.number().optional(),
    StudentID: Joi.string().optional(),
    SchoolCode: Joi.string().optional(),
    TotalFeesPaidAmount: Joi.number().required(),
    Gross_Amount: Joi.number().required(),
    EmailIDForPayment: Joi.string().optional(),
    PaymentDate: Joi.date().optional(),
    ModeOfPayment: Joi.string().optional(),
    CheckOrRefNumber: Joi.string().optional(),
    NameOfBank: Joi.string().optional(),
    Remarks: Joi.string().optional(),
    TxnIDFromPG: Joi.string().optional(),
    order_id: Joi.string().optional(),
    payment_gateway_response: Joi.object().optional(),
    AddressZone: Joi.string().optional(),
    Currency: Joi.string().optional(),
    CreatedOn: Joi.date().optional(),
    CreatedBy: Joi.string().optional(),
    UpdatedOn: Joi.date().optional(),
    UpdatedBy: Joi.string().optional(),
    isDeleted: Joi.string().optional(),

});

const updateFeesCollectionZoneWiseSchema = Joi.object().keys({
    SchoolID: Joi.number().required(),
    SchoolName: Joi.string().required(),
    TotalFeesPaidAmount: Joi.number().required(),
    Gross_Amount: Joi.number().required(),
    EmailIDForPayment: Joi.string().required(),
    BusOperatorID: Joi.number().optional(),
    StudentID: Joi.string().optional(),
    SchoolCode: Joi.string().optional(),
    PaymentDate: Joi.date().optional(),
    ModeOfPayment: Joi.string().optional(),
    CheckOrRefNumber: Joi.string().optional(),
    NameOfBank: Joi.string().optional(),
    Remarks: Joi.string().optional(),
    TxnIDFromPG: Joi.string().optional(),
    order_id: Joi.string().optional(),
    payment_gateway_response: Joi.object().optional(),
    AddressZone: Joi.string().optional(),
    Currency: Joi.string().optional(),
    CreatedOn: Joi.date().optional(),
    CreatedBy: Joi.string().optional(),
    UpdatedOn: Joi.date().optional(),
    UpdatedBy: Joi.string().required(),
    isDeleted: Joi.string().optional(),

})


module.exports = {
    createFeesCollectionZoneWiseSchema,
    updateFeesCollectionZoneWiseSchema
};
