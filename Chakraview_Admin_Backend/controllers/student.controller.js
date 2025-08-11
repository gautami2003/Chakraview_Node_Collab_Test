const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const studentService = require('../services/student.service');
const schoolService = require('../services/schoolMaster.service');
// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");
const { CREATED } = require("../constants/http-status-code.constant");
const paginationConstant = require("../constants/pagination.constant");


const getAllStudent = async (req, res) => {
    const busOperatorId = req.user.busOperatorID;
    const { page } = req.query;
    try {
        const totalPage = parseInt(page) || 1;
        const totalLimit = parseInt(paginationConstant.LIMIT);
        const getStudent = await studentService.getAllStudent(busOperatorId, totalPage, totalLimit);
        const week = {
            Monday: "M",
            Tuesday: "T",
            Wednesday: "W",
            Thursday: "TH",
            Friday: "F",
            Saturday: "S",
            Sunday: "SU",
        };

        const getDays = (data, prefix) => {
            const days = [];
            for (const [day, short] of Object.entries(week)) {
                if (data[`${prefix}${day}`] === "Y") {
                    days.push(short);
                }
            }
            return days;
        };

        let result = [];
        for (let index = 0; index < getStudent.rows.length; index++) {
            const data = getStudent.rows[index];
            let pickupDays = getDays(data, "Pickup");
            let dropDays = getDays(data, "Drop");
            let stayBackDropDays = getDays(data, "StayBackDrop");
            // let pickupDays = [];
            // pickupDays.push(data.PickupMonday === "Y" ? "M" : "");
            // pickupDays.push(data.PickupTuesday === "Y" ? "T" : "");
            // pickupDays.push(data.PickupWednesday === "Y" ? "W" : "");
            // pickupDays.push(data.PickupThursday === "Y" ? "TH" : "");
            // pickupDays.push(data.PickupFriday === "Y" ? "F" : "");
            // pickupDays.push(data.PickupSaturday === "Y" ? "S" : "");
            // pickupDays.push(data.PickupSunday === "Y" ? "SU" : "");
            // let dropDays = [];
            // dropDays.push(data.DropMonday === "Y" ? "M" : "");
            // dropDays.push(data.DropTuesday === "Y" ? "T" : "");
            // dropDays.push(data.DropWednesday === "Y" ? "W" : "");
            // dropDays.push(data.DropThursday === "Y" ? "TH" : "");
            // dropDays.push(data.DropFriday === "Y" ? "F" : "");
            // dropDays.push(data.DropSaturday === "Y" ? "S" : "");
            // dropDays.push(data.DropSunday === "Y" ? "SU" : "");
            // let stayBackDropDays = [];
            // stayBackDropDays.push(data.StayBackDropMonday === "Y" ? "M" : "");
            // stayBackDropDays.push(data.StayBackDropTuesday === "Y" ? "T" : "");
            // stayBackDropDays.push(data.StayBackDropWednesday === "Y" ? "W" : "");
            // stayBackDropDays.push(data.StayBackDropThursday === "Y" ? "TH" : "");
            // stayBackDropDays.push(data.StayBackDropFriday === "Y" ? "F" : "");
            // stayBackDropDays.push(data.StayBackDropSaturday === "Y" ? "S" : "");
            // stayBackDropDays.push(data.StayBackDropSunday === "Y" ? "SU" : "");
            result.push({
                studentID: data?.StudentID || "",
                fatherName: data?.FatherName || "",
                motherName: data?.MotherName || "",
                busName: data?.BusName || "",
                schoolName: data?.school_master.SchoolName || "",
                schoolSection: data?.SchoolSection || "",
                studentName: data?.StudentName || "",
                studentNameHindi: data?.StudentNameHindi || "",
                studentStandard: data?.StudentStandard || "",
                studentClass: data?.StudentClass || "",
                fatherMobileNumber: data?.FatherMobileNumber || "",
                motherMobileNumber: data?.MotherMobileNumber || "",
                otherMobileNumber: data?.OtherMobileNumber || "",
                primaryMobileNumberOf: data?.PrimaryMobileNumberOf || "",
                isBan: data?.isBan || "",
                fromRouteName: data?.pickup_route_master?.RouteName || "",
                toRouteName: data?.drop_route_master?.RouteName || "",
                fromStoppageName: data?.stoppage_master?.StopageName || "",
                toStoppageName: data?.ToStoppage?.StopageName || "",
                chakraviewCode: data?.ChakraviewCode || "",
                schoolCode: data?.SchoolCode || "",
                year: data?.Year || "",
                pickupDays: pickupDays.join(","),
                dropDays: dropDays.join(","),
                stayBackToRouteName: data?.StayBackRoute?.RouteName || "",
                stayBackDropDays: stayBackDropDays ? stayBackDropDays.join(",") : "",
            });
        }
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { count: getStudent.count, totalLimit: totalLimit, result });
    } catch (error) {
        await logError(req, res, "student", "getAllStudent", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const createStudent = async (req, res) => {
    const { body } = req;
    const busOperatorId = req.user.busOperatorID;
    try {
        await studentService.createStudent(busOperatorId, body)

        return apiHelper.success(res, COMMON_MESSAGES.ACCOUNT_ACTIVATED, {}, {}, true, CREATED);

    } catch (error) {
        await logError(req, res, "student", "createStudent", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }

};

const updateStudent = async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    const busOperatorId = req.user.busOperatorID;
    try {
        await studentService.updateStudent(id, busOperatorId, body)

        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED, {}, {});

    } catch (error) {
        await logError(req, res, "student", "updateStudent", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {

        let data = await studentService.deleteStudent(id)

        if (data) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DELETE_ERROR;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "student", "deleteStudent", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const studentFeesUpdate = async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    try {
        await studentService.studentFeesUpdate(id, body)

        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED, {}, {});

    } catch (error) {
        await logError(req, res, "student", "studentFeesUpdate", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getStudentListByNo = async (req, res) => {
    const phoneNumber = req.user.phoneNumber;
    try {
        const getStudentListByNo = await studentService.getStudentListByNo(phoneNumber);

        const result = getStudentListByNo.map((data) => {
            return {
                studentID: data.StudentID,
                studentName: data.StudentName,
                studentImg: data.Student_Img ? `https://d2k5zi4k7zj5o2.cloudfront.net/${data.Student_Img}` : "",
                schoolCode: data.SchoolCode,
                schoolID: data.school_master?.SchoolID || "",
                schoolName: data.school_master?.SchoolName || "",
                busOperator: data.bus_operator_master?.BusOperatorName || "",
            }
        })

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    } catch (error) {
        await logError(req, res, "student", "getStudentListByNo", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getStudentPayFeeszon = async (req, res) => {
    const { studentID, schoolID } = req.query;
    try {
        const getStudentPayFeeszon = await studentService.getStudentPayFeeszon(studentID);
        const getPaneltyMessage = await studentService.getPaneltyMessage(schoolID);
        const getSchoolFeesDiscounts = await schoolService.getSchoolFeesDiscounts(schoolID);

        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;
        const shortYear = moment().format("YY")
        const year = `${previousYear}-${shortYear}`

        const studentYear = getStudentPayFeeszon.map(data => data.Year)
        if (studentYear == year) {
            getStudentPayFeeszon[0].paneltyAmount = getPaneltyMessage?.penalty_amount;
            getStudentPayFeeszon[0].penaltyMessage = getPaneltyMessage?.message.replace('[amount]', getPaneltyMessage.penalty_amount);
        };
        getStudentPayFeeszon[0].discounts = getSchoolFeesDiscounts.length > 0 ? 1 : 0;

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, getStudentPayFeeszon);
    } catch (error) {
        await logError(req, res, "student", "getStudentPayFeeszon", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

module.exports = {
    getAllStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    studentFeesUpdate,
    getStudentListByNo,
    getStudentPayFeeszon,
};
