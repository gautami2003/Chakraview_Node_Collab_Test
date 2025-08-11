const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const feesMasterZonewiseService = require('../services/feesMasterZonewise.service');
const schoolService = require('../services/schoolMaster.service');
// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");


const getFeesMasterZonewise = async (req, res) => {
    const busOperatorId = req.user.busOperatorID
    try {
        const getFeesMasterZonewise = await feesMasterZonewiseService.getFeesMasterZonewise(busOperatorId)
        const result = getFeesMasterZonewise.map((data) => {
            return {
                feesID: data.FeesID,
                schoolID: data.SchoolID,
                schoolName: data?.school_master?.SchoolName,
                addressZone: data.AddressZone,
                currency: data.Currency,
                monthly_Period: data.Monthly_Period,
                monthly_Amount: data.Monthly_Amount,
                quarterly_Period: data.Quarterly_Period,
                quarterly_Amount: data.Quarterly_Amount,
                quadrimester_Amount: data.Quadrimester_Amount,
                quadrimester_Period: data.Quadrimester_Period,
                annual_Period: data.Annual_Period,
                annual_Amount: data.Annual_Amount,
                semiAnnual_Period: data.SemiAnnual_Period,
                semiAnnual_Amount: data.SemiAnnual_Amount,
                duedateForPayment: data.duedateForPayment
            }
        })
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    } catch (error) {
        await logError(req, res, "feesMasterZonewiseController", "getfeesMasterZonewise", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const createFeesMasterZonewise = async (req, res) => {
    const { body } = req;
    const busOperatorID = req.user.busOperatorID

    try {
        let data = await feesMasterZonewiseService.createFeesMasterZonewise(body, busOperatorID)

        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.CREATE_ERROR, {}, {}, false);
        }
    } catch (error) {
        await logError(req, res, "feesMasterZonewiseController", "createFeesMasterZonewise", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateFeesMasterZonewise = async (req, res) => {
    const { body } = req;
    const { id } = req.params;

    try {
        let data = await feesMasterZonewiseService.updateFeesMasterZonewise(id, body)
        if (data) {
            return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.UPDATE_ERROR, {}, {}, false);
        }
    } catch (error) {
        await logError(req, res, "feesMasterZonewiseController", "updateFeesMasterZonewise", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deletefeesMasterZonewise = async (req, res) => {
    const { id } = req.params;
    try {

        let data = await feesMasterZonewiseService.deletefeesMasterZonewise(id)

        if (data) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DELETE_ERROR;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "feesMasterZonewiseController", "deletefeesMasterZonewise", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getAddressZone = async (req, res) => {
    const { schoolID } = req.query;
    try {
        const getAddressZone = await feesMasterZonewiseService.getAddressZone(schoolID)

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, getAddressZone);
    } catch (error) {
        await logError(req, res, "feesMasterZonewiseController", "getAddressZone", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const paymentFrequencyDropDown = async (req, res) => {
    const { schoolID, addressZone } = req.query;
    try {
        const paymentFrequencyDropDown = await feesMasterZonewiseService.paymentFrequencyDropDown(schoolID, addressZone);

        let result = {
            monthlyPeriod: paymentFrequencyDropDown.Monthly_Amount > 0 ? true : false,
            quarterlyPeriod: paymentFrequencyDropDown.Quarterly_Amount > 0 ? true : false,
            quadrimesterPeriod: paymentFrequencyDropDown.Quadrimester_Amount > 0 ? true : false,
            semiAnnualPeriod: paymentFrequencyDropDown.SemiAnnual_Amount > 0 ? true : false,
            annualPeriod: paymentFrequencyDropDown.Annual_Amount > 0 ? true : false
        };

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    } catch (error) {
        await logError(req, res, "feesMasterZonewiseController", "paymentFrequencyDropDown", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};


const getPaymentFrequency = async (req, res) => {
    const { schoolID, addressZone, type, routeType, standard } = req.query;
    try {
        const getPaymentFrequency = await feesMasterZonewiseService.getPaymentFrequency(schoolID, addressZone);
        let schoolFeesDiscounts;
        if (routeType) {
            schoolFeesDiscounts = await schoolService.schoolFeesDiscounts(schoolID, routeType, type, standard);
        }
        console.log(schoolFeesDiscounts, "schoolFeesDiscountsschoolFeesDiscountsschoolFeesDiscounts");

        let result = {};

        if (type === "monthly") {
            const discountedAmount = getPaymentFrequency.Monthly_Amount - (getPaymentFrequency.Monthly_Amount * schoolFeesDiscounts?.discount / 100);
            result.period = getPaymentFrequency.Monthly_Period;
            result.amount = getPaymentFrequency.Monthly_Amount > 0 ? schoolFeesDiscounts ? Math.round(discountedAmount) : getPaymentFrequency.Monthly_Amount : 0;
            result.grossAmount = getPaymentFrequency.Monthly_Amount > 0 ? getPaymentFrequency.Monthly_Amount : 0;
        } else if (type === "quarterly") {
            const discountedAmount = getPaymentFrequency.Quarterly_Amount - (getPaymentFrequency.Quarterly_Amount * schoolFeesDiscounts?.discount / 100);
            result.period = getPaymentFrequency.Quarterly_Period;
            result.amount = getPaymentFrequency.Quarterly_Amount > 0 ? schoolFeesDiscounts ? Math.round(discountedAmount) : getPaymentFrequency.Quarterly_Amount : 0;
            result.grossAmount = getPaymentFrequency.Quarterly_Amount > 0 ? getPaymentFrequency.Quarterly_Amount : 0;

        } else if (type === "quadrimester") {
            const discountedAmount = getPaymentFrequency.Quadrimester_Amount - (getPaymentFrequency.Quadrimester_Amount * schoolFeesDiscounts?.discount / 100);
            result.period = getPaymentFrequency.Quadrimester_Period;
            result.amount = getPaymentFrequency.Quadrimester_Amount > 0 ? schoolFeesDiscounts ? Math.round(discountedAmount) : getPaymentFrequency.Quadrimester_Amount : 0;
            result.grossAmount = getPaymentFrequency.Quadrimester_Amount > 0 ? getPaymentFrequency.Quadrimester_Amount : 0;

        } else if (type === "semiAnnual") {
            const discountedAmount = getPaymentFrequency.SemiAnnual_Amount - (getPaymentFrequency.SemiAnnual_Amount * schoolFeesDiscounts?.discount / 100);
            result.period = getPaymentFrequency.SemiAnnual_Period;
            result.amount = getPaymentFrequency.SemiAnnual_Amount > 0 ? schoolFeesDiscounts ? Math.round(discountedAmount) : getPaymentFrequency.SemiAnnual_Amount : 0;
            result.grossAmount = getPaymentFrequency.SemiAnnual_Amount > 0 ? getPaymentFrequency.SemiAnnual_Amount : 0;

        } else if (type === "annual") {
            result.period = getPaymentFrequency.Annual_Period;
            const discountedAmount = getPaymentFrequency.Annual_Amount - (getPaymentFrequency.Annual_Amount * schoolFeesDiscounts?.discount / 100);
            result.amount = getPaymentFrequency.Annual_Amount > 0 ? schoolFeesDiscounts ? Math.round(discountedAmount) : getPaymentFrequency.Annual_Amount : 0;
            result.grossAmount = getPaymentFrequency.Annual_Amount > 0 ? getPaymentFrequency.Annual_Amount : 0;
        };
        result.monthlyPeriod = getPaymentFrequency.Monthly_Amount > 0 ? 1 : 0;
        result.quarterlyPeriod = getPaymentFrequency.Quarterly_Amount > 0 ? 1 : 0;
        result.quadrimesterPeriod = getPaymentFrequency.Quadrimester_Amount > 0 ? 1 : 0;
        result.semiAnnualPeriod = getPaymentFrequency.SemiAnnual_Amount > 0 ? 1 : 0;
        result.annualPeriod = getPaymentFrequency.Annual_Amount > 0 ? 1 : 0;

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    } catch (error) {
        await logError(req, res, "feesMasterZonewiseController", "getPaymentFrequency", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};


module.exports = {
    getFeesMasterZonewise,
    createFeesMasterZonewise,
    updateFeesMasterZonewise,
    deletefeesMasterZonewise,
    getAddressZone,
    getPaymentFrequency,
    paymentFrequencyDropDown
};
