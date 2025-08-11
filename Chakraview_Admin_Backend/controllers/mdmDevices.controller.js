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
const redisService = require("../services/redis.service");
const paginationConstant = require("../constants/pagination.constant");

const getMDMDevices = async (req, res) => {

    const { page, deviceSerialNumber, secondaryModel, deviceType } = req.query;

    try {
        const totalPage = parseInt(page) || 1;
        const totalLimit = parseInt(paginationConstant.LIMIT);
        const offset = (totalPage - 1) * totalLimit;
        const whereCondition = {
            isDeleted: "N",
            ...(secondaryModel && { SecondaryModel: secondaryModel }),
            ...(deviceSerialNumber && { DeviceSerialNumber: deviceSerialNumber }),
        };
        let getDevices;

        // if (deviceType == "") {
        getDevices = await DB_MODELS.MDM_DEVICE_MASTER.findAndCountAll({
            attributes: ["DeviceID", "DeviceSerialNumber", "IMEI1", "PrimaryModel", "SecondaryModel"],
            where: whereCondition,
            limit: totalLimit,
            offset: offset,
            raw: true
        });
        // } else if (deviceType == "allocated") {
        //     getDevices = await DB_MODELS.MDM_DEVICE_MASTER.findAndCountAll({
        //         attributes: ["DeviceID", "DeviceSerialNumber", "IMEI1", "PrimaryModel", "SecondaryModel"],
        //         where: { isDeleted: "N" },
        //         include: {
        //             model: DB_MODELS.ALLOCATION,
        //             attributes: [],
        //             where: { isDeleted: "N", isActive: 'Y' },
        //         },
        //         limit: totalLimit,
        //         offset: offset,
        //         raw: true
        //     });
        // }

        // const getDevice = getDevices.rows;
        // const totalRecords = getDevices.count;

        const result = getDevices.rows.map((data) => ({
            deviceID: data.DeviceID,
            deviceSerialNumber: data.DeviceSerialNumber,
            iMEI1: data.IMEI1,
            primaryModel: data.PrimaryModel,
            secondaryModel: data.SecondaryModel,
        }))

        // return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { count: getDevices.count, totalPages: Math.ceil(getDevices.count / totalLimit), result });
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { count: getDevices.count, totalLimit: totalLimit, result });

    }
    catch (error) {
        await logError(req, res, "mdmDevicesController", "MDMDevices", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getDevicesNameList = async (req, res) => {
    try {
        const redisKey = `admin_devices_list`;
        const getBusOperatorName = await redisService.getRedisValue(redisKey);
        if (getBusOperatorName) {
            return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, JSON.parse(getBusOperatorName));
        }

        let deviceSerialNumber = await DB_MODELS.MDM_DEVICE_MASTER.findAll({
            attributes: ["DeviceSerialNumber"],
            where: {
                isDeleted: 'N'
            },
            group: ['DeviceSerialNumber'],
            order: ["DeviceSerialNumber"]
        });
        let secondaryModel = await DB_MODELS.MDM_DEVICE_MASTER.findAll({
            attributes: ["SecondaryModel"],
            where: {
                isDeleted: 'N',
                SecondaryModel: {
                    [Op.ne]: " "
                },
            },
            group: ['SecondaryModel'],
            order: ["SecondaryModel"]
        });

        const result = {
            deviceSerialNumber: deviceSerialNumber.map(data => data.DeviceSerialNumber),
            secondaryModel: secondaryModel.map(data => data.SecondaryModel)
        }

        await redisService.setRedisValue(redisKey, JSON.stringify(result), 3600);
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);

    } catch (error) {
        await logError(req, res, "mdmDevicesController", "getDevicesNameList", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const createMdmDevices = async (req, res) => {
    const { deviceSerialNumber, iMEI1, iMEI2, dateOfPurchased, primaryModel, secondaryModel, androidVersion, vendor_1, vendor_2, price, modeOfPayment, paymentAccount, color, remarks_Repair, remarks_Lost, remarks_Battery_Change, remarks_Exchanged, remarks_Misc, device_Type } = req.body;
    try {

        const selSerialNumber = await DB_MODELS.MDM_DEVICE_MASTER.findOne({
            attributes: ["DeviceSerialNumber", "IMEI1"],
            where: {
                [Op.or]: [
                    { DeviceSerialNumber: deviceSerialNumber },
                    { IMEI1: iMEI1 }
                ],
                isDeleted: 'N'
            },
            raw: true
        });

        if (selSerialNumber?.DeviceSerialNumber === deviceSerialNumber) {
            return apiHelper.success(res, COMMON_MESSAGES.DEVICE_EXISTS, {}, {}, false);
        } else if (selSerialNumber?.IMEI1 === iMEI1) {
            return apiHelper.success(res, COMMON_MESSAGES.IMEI1_EXISTS, {}, {}, false);
        } else {
            await DB_MODELS.MDM_DEVICE_MASTER.create({
                DeviceSerialNumber: deviceSerialNumber,
                IMEI1: iMEI1,
                IMEI2: iMEI2,
                DateOfPurchased: dateOfPurchased,
                PrimaryModel: primaryModel,
                SecondaryModel: secondaryModel,
                AndroidVersion: androidVersion,
                Vendor_1: vendor_1,
                Vendor_2: vendor_2,
                Price: price,
                ModeOfPayment: modeOfPayment,
                PaymentAccount: paymentAccount,
                Color: color,
                Remarks_Battery_Change: remarks_Battery_Change,
                Remarks_Repair: remarks_Repair,
                Remarks_Lost: remarks_Lost,
                Remarks_Exchanged: remarks_Exchanged,
                Remarks_Misc: remarks_Misc,
                Device_Type: device_Type,
                CreatedBy: "Admin",
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
            })
        };
        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);
    } catch (error) {
        await logError(req, res, "mdmDevicesController", "createMdmDevices", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateMdmDevices = async (req, res) => {
    const { deviceSerialNumber, iMEI1, iMEI2, dateOfPurchased, primaryModel, secondaryModel, androidVersion, vendor_1, vendor_2, price, modeOfPayment, paymentAccount, color, remarks_Repair, remarks_Lost, remarks_Battery_Change, remarks_Exchanged, remarks_Misc, device_Type } = req.body;
    const { id } = req.params;
    try {
        const selSerialNumber = await DB_MODELS.MDM_DEVICE_MASTER.findOne({
            attributes: ["DeviceSerialNumber", "IMEI1"],
            where: {
                [Op.or]: [
                    { DeviceSerialNumber: deviceSerialNumber },
                    { IMEI1: iMEI1 }
                ],
                DeviceID: { [Op.ne]: id },
                isDeleted: 'N'
            },
            raw: true
        });

        if (selSerialNumber?.DeviceSerialNumber === deviceSerialNumber) {
            return apiHelper.success(res, COMMON_MESSAGES.DEVICE_EXISTS, {}, {}, false);
        } else if (selSerialNumber?.IMEI1 === iMEI1) {
            return apiHelper.success(res, COMMON_MESSAGES.IMEI1_EXISTS, {}, {}, false);
        } else {
            await DB_MODELS.MDM_DEVICE_MASTER.update({
                DeviceSerialNumber: deviceSerialNumber,
                IMEI1: iMEI1,
                IMEI2: iMEI2,
                DateOfPurchased: dateOfPurchased,
                PrimaryModel: primaryModel,
                SecondaryModel: secondaryModel,
                AndroidVersion: androidVersion,
                Vendor_1: vendor_1,
                Vendor_2: vendor_2,
                Price: price,
                ModeOfPayment: modeOfPayment,
                PaymentAccount: paymentAccount,
                Color: color,
                Remarks_Battery_Change: remarks_Battery_Change,
                Remarks_Repair: remarks_Repair,
                Remarks_Lost: remarks_Lost,
                Remarks_Exchanged: remarks_Exchanged,
                Remarks_Misc: remarks_Misc,
                Device_Type: device_Type,
                UpdatedBy: "Admin",
                UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
            },
                { where: { DeviceID: id } }
            )
        };
        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
    } catch (error) {
        await logError(req, res, "mdmDevicesController", "updateMdmDevices", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};


const deleteMdmDevices = async (req, res) => {
    const { id } = req.params;
    try {

        const deleteMDMDevices = await DB_MODELS.MDM_DEVICE_MASTER.update(
            { isDeleted: 'Y' },
            {
                where: { DeviceID: id }
            }
        );
        if (deleteMDMDevices > 0) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DE;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "mdmDevicesController", "deleteMdmDevices", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

module.exports = {
    getMDMDevices,
    getDevicesNameList,
    createMdmDevices,
    updateMdmDevices,
    deleteMdmDevices,
};
