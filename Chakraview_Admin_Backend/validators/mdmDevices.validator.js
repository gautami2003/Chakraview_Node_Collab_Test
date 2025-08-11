const Joi = require("joi");

const createMdmDevicesSchema = Joi.object().keys({
    deviceSerialNumber: Joi.string().required(),
    iMEI1: Joi.string().required(),
    iMEI2: Joi.string().optional().allow(""),
    dateOfPurchased: Joi.string().optional().allow(""),
    primaryModel: Joi.string().optional().allow(""),
    secondaryModel: Joi.string().optional().allow(""),
    androidVersion: Joi.string().optional().allow(""),
    vendor_1: Joi.string().optional().allow(""),
    vendor_2: Joi.string().optional().allow(""),
    price: Joi.string().optional().allow(""),
    modeOfPayment: Joi.string().optional().allow(""),
    paymentAccount: Joi.string().optional().allow(""),
    color: Joi.string().optional().allow(""),
    remarks_Repair: Joi.string().optional().allow(""),
    remarks_Lost: Joi.string().optional().allow(""),
    remarks_Battery_Change: Joi.string().optional().allow(""),
    remarks_Exchanged: Joi.string().optional().allow(""),
    remarks_Misc: Joi.string().optional().allow(""),
    device_Type: Joi.string().optional().allow(""),
});

module.exports = {
    createMdmDevicesSchema,
};
