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

const getMDMAllocation = async (req, res) => {
    const { page, school, deviceSerialNumber, simSerialNumber, attendant } = req.query;
    try {
        const totalPage = parseInt(page) || 1;
        const totalLimit = parseInt(paginationConstant.LIMIT);
        const offset = (totalPage - 1) * totalLimit;
        const whereCondition = {
            isDeleted: "N",
            ...(school && { School: school }),
            ...(deviceSerialNumber && { DeviceSerialNumber: deviceSerialNumber }),
            ...(simSerialNumber && { SimSerialNumber: simSerialNumber }),
            ...(attendant && { Attendant: attendant })
        };
        let getAllocation = await DB_MODELS.ALLOCATION.findAndCountAll({
            attributes: ["AllocationID", "Attendant", "DeviceSerialNumber", "DeviceSubmitDate", "Device_Submit_Person", "RouteNumber", "School", "SimSerialNumber"],
            // where: { isDeleted: "N" },
            where: whereCondition,
            limit: totalLimit,
            offset: offset,
            raw: true
        })

        const result = getAllocation.rows.map((data) => ({
            allocationID: data.AllocationID,
            attendant: data.Attendant,
            deviceSerialNumber: data.DeviceSerialNumber,
            deviceSubmitDate: data.DeviceSubmitDate,
            device_Submit_Person: data.Device_Submit_Person,
            routeNumber: data.RouteNumber,
            school: data.School,
            simSerialNumber: data.SimSerialNumber
        }))

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { count: getAllocation.count, totalLimit: totalLimit, result: result });

    }
    catch (error) {
        await logError(req, res, "mdmAllocationController", "MDMAllocation", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getAllocationList = async (req, res) => {
    try {
        const redisKey = `admin_allocation_list`;
        const getBusOperatorName = await redisService.getRedisValue(redisKey);
        if (getBusOperatorName) {
            return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, JSON.parse(getBusOperatorName));
        }

        let attendantList = await DB_MODELS.ALLOCATION.findAll({
            attributes: ["AllocationID", "Attendant"],
            where: {
                isDeleted: 'N'
            },
            group: ["Attendant"],
            order: ["Attendant"],
        });

        let deviceSerialNumber = await DB_MODELS.ALLOCATION.findAll({
            attributes: ["DeviceSerialNumber"],
            where: {
                isDeleted: 'N'
            },
            group: ["DeviceSerialNumber"],
            order: ["DeviceSerialNumber"]
        });
        let schoolList = await DB_MODELS.ALLOCATION.findAll({
            attributes: ["School",],
            where: {
                isDeleted: 'N'
            },
            group: ["School"],
            order: ["School"]
        });
        let simSerialNumber = await DB_MODELS.ALLOCATION.findAll({
            attributes: ["SimSerialNumber"],
            where: {
                isDeleted: 'N'
            },
            group: ["SimSerialNumber"],
            order: ["SimSerialNumber"]
        });

        let attendantresult = [];
        let deviceSerialNumberresult = [];
        let schoolListresult = [];
        let simSerialNumberresult = [];

        for (let index = 0; index < attendantList.length; index++) {
            const data = attendantList[index];
            if (data.Attendant != " ") {
                attendantresult.push(data.Attendant)
            }
        }
        for (let index = 0; index < deviceSerialNumber.length; index++) {
            const data = deviceSerialNumber[index];
            if (data.DeviceSerialNumber != 0) {
                deviceSerialNumberresult.push(data.DeviceSerialNumber)
            }
        }
        for (let index = 0; index < schoolList.length; index++) {
            const data = schoolList[index];
            if (data.School != " " && data.School != "") {
                schoolListresult.push(data.School)
            }
        }
        for (let index = 0; index < simSerialNumber.length; index++) {
            const data = simSerialNumber[index];
            if (data.SimSerialNumber != 0) {
                simSerialNumberresult.push(data.SimSerialNumber)
            }
        }
        const result = { attendantresult, deviceSerialNumberresult, schoolListresult, simSerialNumberresult }
        await redisService.setRedisValue(redisKey, JSON.stringify(result), 3600);
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);

    } catch (error) {
        await logError(req, res, "mdmAllocationController", "getAllocationList", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const createMdmAllocatio = async (req, res) => {
    const { deviceSerialNumber, simSerialNumber, school, attendant, routeNumber, deviceSubmitDate, device_Submit_Person } = req.body;
    try {
        await DB_MODELS.ALLOCATION.create({
            DeviceSerialNumber: deviceSerialNumber,
            SimSerialNumber: simSerialNumber,
            School: school,
            RouteNumber: routeNumber,
            Attendant: attendant,
            DeviceSubmitDate: deviceSubmitDate,
            Device_Submit_Person: device_Submit_Person,
            DateTime: moment().format("YYYY MM DD, h:mm:ss"),
            isActive: 'Y',
            CreatedBy: "Admin",
        })

        let type
        if (deviceSerialNumber != 0 && simSerialNumber != 0) {
            type = "Device AND Sim";
        } else if (simSerialNumber != 0) {
            type = "Sim";
        } else if (deviceSerialNumber != 0) {
            type = "Device";
        } else {
            type = "None";
        }

        await DB_MODELS.ALLOCATION_HISTORY.create({
            DeviceSerialNumber: deviceSerialNumber,
            SimSerialNumber: simSerialNumber,
            School: school,
            Attendant: attendant,
            RouteNumber: routeNumber,
            DeviceSubmitDate: deviceSubmitDate,
            DeviceSubmitPerson: device_Submit_Person,
            Type: type,
            CreatedBy: "Admin",
            CreatedOn: moment().format("YYYY MM DD, h:mm:ss"),
        })

        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);
    } catch (error) {
        await logError(req, res, "mdmAllocationController", "createMdmAllocatio", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateMdmAllocatio = async (req, res) => {
    const { deviceSerialNumber, simSerialNumber, school, attendant, routeNumber, deviceSubmitDate, device_Submit_Person } = req.body;
    const { id } = req.params;
    try {
        await DB_MODELS.ALLOCATION.update({
            DeviceSerialNumber: deviceSerialNumber,
            SimSerialNumber: simSerialNumber,
            School: school,
            RouteNumber: routeNumber,
            Attendant: attendant,
            DeviceSubmitDate: deviceSubmitDate,
            Device_Submit_Person: device_Submit_Person,
            UpdatedBy: "Admin",
            UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
        },
            { where: { AllocationID: id } }
        )

        let type
        if (deviceSerialNumber != 0 && simSerialNumber != 0) {
            type = "Device AND Sim";
        } else if (simSerialNumber != 0) {
            type = "Sim";
        } else if (deviceSerialNumber != 0) {
            type = "Device";
        } else {
            type = "None";
        }

        await DB_MODELS.ALLOCATION_HISTORY.create({
            DeviceSerialNumber: deviceSerialNumber,
            SimSerialNumber: simSerialNumber,
            School: school,
            Attendant: attendant,
            RouteNumber: routeNumber,
            DeviceSubmitDate: deviceSubmitDate,
            DeviceSubmitPerson: device_Submit_Person,
            Type: type,
            CreatedBy: "Admin",
            CreatedOn: moment().format("YYYY MM DD, h:mm:ss"),
        })


        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
    } catch (error) {
        await logError(req, res, "mdmAllocationController", "updateMdmAllocatio", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};


const deleteMdmAllocation = async (req, res) => {
    const { id } = req.params;
    try {

        const deleteAllocation = await DB_MODELS.ALLOCATION.update(
            { isDeleted: 'Y' },
            {
                where: { AllocationID: id }
            }
        );
        if (deleteAllocation > 0) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DELETE_ERROR;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "mdmAllocationController", "deleteMdmAllocation", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

module.exports = {
    getMDMAllocation,
    getAllocationList,
    createMdmAllocatio,
    updateMdmAllocatio,
    deleteMdmAllocation
};
