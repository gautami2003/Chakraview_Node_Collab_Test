const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");

// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");
const paginationConstant = require("../constants/pagination.constant");
const redisService = require("../services/redis.service");

const MDMSimcards = async (req, res) => {
    const { page, simSerialNumber, networkProvider, simType, simStatus } = req.query;
    try {
        const totalPage = parseInt(page) || 1;
        const totalLimit = parseInt(paginationConstant.LIMIT);
        const offset = (totalPage - 1) * totalLimit;
        const whereCondition = {
            isDeleted: "N",
            ...(simSerialNumber && { SimSerialNumber: simSerialNumber }),
            ...(networkProvider && { NetworkProvider: networkProvider }),
            ...(simType && { SimType: simType }),
            ...(simStatus && { SimStatus: simStatus }),
        };
        const simcard = await DB_MODELS.MDM_SIMCARD_DETAIL.findAndCountAll({
            attributes: ["SIMID", "SimSerialNumber", "NetworkProvider", "PhoneNumber", "SIMNumber", "SIMPurchaseDate", "PostpaidPlanName", "PostpaidPlanRental", "SimType", "SimStatus", "RechargeType", "PostpaidPlanName", "PrepaidPlanName", "PrepaidRechargeDate", "PrepaidRechargeAmount", "CustID"],
            where: whereCondition,
            limit: totalLimit,
            offset: offset,
        })

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { count: simcard.count, totalLimit: totalLimit, result: simcard.rows });
    }
    catch (error) {
        await logError(req, res, "busOperatorController", "MDMSimcards", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getSimcardsList = async (req, res) => {
    try {
        const redisKey = `admin_simcards_list`;
        const getBusOperatorName = await redisService.getRedisValue(redisKey);
        if (getBusOperatorName) {
            return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, JSON.parse(getBusOperatorName));
        }

        let simSerialNo = await DB_MODELS.MDM_SIMCARD_DETAIL.findAll({
            attributes: ["SimSerialNumber"],
            where: {
                isDeleted: 'N'
            },
            group: ['SimSerialNumber'],
        });
        let networkProvider = await DB_MODELS.MDM_SIMCARD_DETAIL.findAll({
            attributes: ["NetworkProvider"],
            where: {
                isDeleted: 'N'
            },
            group: ['NetworkProvider'],
            order: ["NetworkProvider"]
        });
        let simType = await DB_MODELS.MDM_SIMCARD_DETAIL.findAll({
            attributes: ["SimType"],
            where: {
                isDeleted: 'N'
            },
            group: ['SimType'],
            order: ["SimType"]
        });
        let simStatus = await DB_MODELS.MDM_SIMCARD_DETAIL.findAll({
            attributes: ["SimStatus"],
            where: {
                isDeleted: 'N',
                SimStatus: {
                    [Op.ne]: " "
                },
            },
            group: ['SimStatus'],
            order: ["SimStatus"]
        });

        const result = {
            simSerialNo: simSerialNo.map(data => data.SimSerialNumber),
            networkProvider: networkProvider.map(data => data.NetworkProvider),
            simType: simType.map(data => data.SimType),
            simStatus: simStatus.map(data => data.SimStatus),
        }

        await redisService.setRedisValue(redisKey, JSON.stringify(result), 100);
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);

    } catch (error) {
        await logError(req, res, "mdmSimcardsController", "getSimcardsList", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const simcardsFilter = async (req, res) => {
    const { simType } = req.query;

    try {
        let simcard;
        if (simType === "Allocated") {
            simcard = await DB_MODELS.MDM_SIMCARD_DETAIL.findAll({
                where: { isDeleted: 'N' },
                include: {
                    model: DB_MODELS.ALLOCATION,
                    where: { isActive: 'Y' },
                    attributes: [],
                },
                raw: true
            })
        } else if (simType === "Unallocated") {
            simcard = await DB_MODELS.MDM_SIMCARD_DETAIL.findAll({
                where: { isDeleted: 'N' },
                include: {
                    model: DB_MODELS.ALLOCATION,
                    where: { isActive: 'Y' },
                    attributes: [],
                },
                raw: true
            })
        } else {
            return apiHelper.success(res, COMMON_MESSAGES.INVALID_SIMTYPE_PROVIDED, {}, {}, false);
        };

        const result = simcard.map((data) => ({
            custID: data.CustID,
            networkProvider: data.NetworkProvider,
            phoneNumber: data.PhoneNumber,
            postpaidPlanName: data.PostpaidPlanName,
            postpaidPlanRental: data.PostpaidPlanRental,
            prepaidPlanName: data.PrepaidPlanName,
            prepaidRechargeAmount: data.PrepaidRechargeAmount,
            prepaidRechargeDate: data.PrepaidRechargeDate,
            rechargeType: data.RechargeType,
            simID: data.SimID,
            sIMNumber: data.SIMNumber,
            sIMPurchaseDate: data.SIMPurchaseDate,
            simSerialNumber: data.SimSerialNumber,
            simStatus: data.SimStatus,
            simType: data.SimType,
        }));

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);

    }
    catch (error) {
        await logError(req, res, "busOperatorController", "simcardsFilter", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const createMdmSimcards = async (req, res) => {
    const { simSerialNumber, networkProvider, simType, rechargeType, phoneNumber, sIMNumber, sIMPurchaseDate, postpaidPlanName, postpaidPlanRental, prepaidPlanName, prepaidRechargeDate, prepaidRechargeAmount, simStatus, custID } = req.body;
    try {

        const selPhoneNumber = await DB_MODELS.MDM_SIMCARD_DETAIL.findOne({
            attributes: ["PhoneNumber"],
            where: { PhoneNumber: phoneNumber, isDeleted: 'N' }
        });

        if (selPhoneNumber) {
            return apiHelper.success(res, COMMON_MESSAGES.PHONE_NUMBER_EXISTS, {}, {}, false);
        } else {
            await DB_MODELS.MDM_SIMCARD_DETAIL.create({
                SimSerialNumber: simSerialNumber,
                NetworkProvider: networkProvider,
                SimType: simType,
                RechargeType: rechargeType,
                PhoneNumber: phoneNumber,
                SIMNumber: sIMNumber,
                SIMPurchaseDate: sIMPurchaseDate,
                PostpaidPlanName: postpaidPlanName,
                PostpaidPlanRental: postpaidPlanRental,
                PrepaidPlanName: prepaidPlanName,
                PrepaidRechargeDate: prepaidRechargeDate,
                PrepaidRechargeAmount: prepaidRechargeAmount,
                SimStatus: simStatus,
                CustID: custID,
                CreatedBy: "Admin",
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
            })

        };

        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);
    } catch (error) {
        await logError(req, res, "mdmSimcardsController", "createMdmSimcards", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateMdmSimcards = async (req, res) => {
    const { simSerialNumber, networkProvider, simType, rechargeType, phoneNumber, sIMNumber, sIMPurchaseDate, postpaidPlanName, postpaidPlanRental, prepaidPlanName, prepaidRechargeDate, prepaidRechargeAmount, simStatus, custID } = req.body;
    const { id } = req.params;
    try {

        const selPhoneNumber = await DB_MODELS.MDM_SIMCARD_DETAIL.findOne({
            attributes: ["PhoneNumber"],
            where: { PhoneNumber: phoneNumber, SIMID: { [Op.ne]: id }, isDeleted: 'N' }
        });

        if (selPhoneNumber > 0) {
            return apiHelper.success(res, COMMON_MESSAGES.PHONE_NUMBER_EXISTS, {}, {}, false);
        } else {
            await DB_MODELS.MDM_SIMCARD_DETAIL.update(
                {
                    SimSerialNumber: simSerialNumber,
                    NetworkProvider: networkProvider,
                    SimType: simType,
                    RechargeType: rechargeType,
                    PhoneNumber: phoneNumber,
                    SIMNumber: sIMNumber,
                    SIMPurchaseDate: sIMPurchaseDate,
                    PostpaidPlanName: postpaidPlanName,
                    PostpaidPlanRental: postpaidPlanRental,
                    PrepaidPlanName: prepaidPlanName,
                    PrepaidRechargeDate: prepaidRechargeDate,
                    PrepaidRechargeAmount: prepaidRechargeAmount,
                    SimStatus: simStatus,
                    CustID: custID,
                    UpdatedBy: "Admin",
                    UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
                },
                { where: { SimID: id } }
            );
        };

        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
    } catch (error) {
        await logError(req, res, "mdmSimcardsController", "updateMdmSimcards", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deleteMdmSimcards = async (req, res) => {
    const { id } = req.params;
    try {

        const deleteMDMSimcards = await DB_MODELS.MDM_SIMCARD_DETAIL.update(
            { isDeleted: 'Y' },
            {
                where: { SimID: id }
            }
        );
        if (deleteMDMSimcards > 0) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DELETE_ERROR;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "mdmSimcardsController", "deleteMdmSimcards", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

module.exports = {
    MDMSimcards,
    getSimcardsList,
    simcardsFilter,
    createMdmSimcards,
    updateMdmSimcards,
    deleteMdmSimcards,
};
