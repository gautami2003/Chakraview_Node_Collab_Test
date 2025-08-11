// const RedisClient = require('../configs/redis.config');
const { date } = require('joi');
const moment = require("moment");
const { DB_MODELS } = require('../constants/models.constant');
const dbService = require('./db.service');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const getAllStudent = async (busOperatorId, page, limit) => {
    const offset = (page - 1) * limit;
    try {
        return await DB_MODELS.STUDENT_MASTER.findAndCountAll({
            where: { BusOperatorID: busOperatorId, isDeleted: 'N' },
            attributes: ["StudentID", "FatherName", "MotherName", "BusName", "SchoolSection", "StudentName", "StudentNameHindi",
                "StudentStandard", "StudentClass", "FatherMobileNumber", "MotherMobileNumber", "OtherMobileNumber", "PrimaryMobileNumberOf", "isBan",
                "Year", "ChakraviewCode", "SchoolCode", "PickupMonday", "PickupTuesday", "PickupWednesday", "PickupThursday", "PickupFriday",
                "PickupSaturday", "PickupSunday", "DropMonday", "DropTuesday", "DropWednesday", "DropThursday", "DropFriday", "DropSaturday", "DropSunday",
                "StayBackDropMonday", "StayBackDropTuesday", "StayBackDropWednesday", "StayBackDropThursday",
                "StayBackDropFriday", "StayBackDropSaturday", "StayBackDropSunday"],
            include: [
                {
                    model: DB_MODELS.SCHOOL_MASTER,
                    attributes: ["SchoolName",],
                    where: { isDeleted: 'N' }
                },
                {
                    model: DB_MODELS.PICKUP_ROUTE_MASTER,
                    attributes: ["RouteName"]
                },
                {
                    model: DB_MODELS.DROP_ROUTE_MASTER,
                    attributes: ["RouteName"]
                },
                {
                    model: DB_MODELS.DROP_ROUTE_MASTER,
                    as: 'StayBackRoute',
                    attributes: ["RouteName"]
                },
                {
                    model: DB_MODELS.STOPPAGE_MASTER,
                    attributes: ["StopageName"]
                },
                {
                    model: DB_MODELS.STOPPAGE_MASTER,
                    as: 'ToStoppage',
                    attributes: ["StopageName"]
                },
            ],
            limit: limit,
            offset: offset,
        })
    } catch (error) {
        throw error;
    }
};

const createStudent = async (busOperatorID, data) => {
    try {
        const getPlanId = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
            where: { BusOperatorID: busOperatorID },
            attributes: ["BusinessType"]
        });

        let planID = "0";

        if (getPlanId.BusinessType == 'B2B' || getPlanId.BusinessType == 'B2C-Retail') {
            planID = "0"
        } else if (getPlanId.BusinessType == 'B2C') {
            planID = "1"
        };

        let primaryMobileNumber;
        if (data.primaryMobileNumberOf === 'Father') {
            primaryMobileNumber = data.fatherMobileNumber;
        } else if (data.primaryMobileNumberOf === 'Mother') {
            primaryMobileNumber = data.motherMobileNumber;
        } else if (data.primaryMobileNumberOf === 'Other') {
            primaryMobileNumber = data.otherMobileNumber;
        };

        let student;
        if (data.pickupMonday !== undefined) {
            student = await DB_MODELS.STUDENT_MASTER.create({
                PlanID: planID,
                BusOperatorID: busOperatorID,
                FatherName: data.fatherName,
                MotherName: data.motherName,
                SchoolID: data.schoolID,
                SchoolSection: data.schoolSection,
                StudentName: data.studentName,
                StudentNameHindi: data.studentNameHindi,
                StudentStandard: data.studentStandard,
                StudentClass: data.studentClass,
                StudentBloodGroup: data.studentBloodGroup,
                CountryID: data.countryID,
                Address1: data.address1,
                Address2: data.address2,
                CityID: data.cityID,
                Pincode: data.pincode,
                FatherMobileNumber: data.fatherMobileNumber,
                MotherMobileNumber: data.motherMobileNumber,
                OtherMobileNumber: data.otherMobileNumber,
                PrimaryMobileNumber: primaryMobileNumber,
                PrimaryMobileNumberOf: data.primaryMobileNumberOf,
                EmailID: data.emailID,
                isBan: "N",
                FromRouteID: data.fromRouteID,
                ToRouteID: data.toRouteID,
                FromStoppageID: data.fromStoppageID,
                ToStoppageID: data.toStoppageID,
                ChakraviewCode: data.chakraviewCode,
                SchoolCode: data.schoolCode,
                PickupMonday: data.pickupMonday,
                PickupTuesday: data.pickupTuesday,
                PickupWednesday: data.pickupWednesday,
                PickupThursday: data.pickupThursday,
                PickupFriday: data.pickupFriday,
                PickupSaturday: data.pickupSaturday,
                PickupSunday: data.pickupSunday,
                DropMonday: data.dropMonday,
                DropTuesday: data.dropTuesday,
                DropWednesday: data.dropWednesday,
                DropThursday: data.dropThursday,
                DropFriday: data.dropFriday,
                DropSaturday: data.dropSaturday,
                DropSunday: data.dropSunday,
                StayBackToRouteID: data.stayBackToRouteID,
                StayBackDropMonday: data.stayBackDropMonday,
                StayBackDropTuesday: data.stayBackDropTuesday,
                StayBackDropWednesday: data.stayBackDropWednesday,
                StayBackDropThursday: data.stayBackDropThursday,
                StayBackDropFriday: data.stayBackDropFriday,
                StayBackDropSaturday: data.stayBackDropSaturday,
                StayBackDropSunday: data.stayBackDropSunday,
                isAttendance: data.isAttendance,
                Year: data.year,
                isDeleted: "N",
                CreatedBy: "Admin",
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss"),
            });
        }
        else {
            student = await DB_MODELS.STUDENT_MASTER.create({
                PlanID: planID,
                BusOperatorID: data.busOperatorID,
                FatherName: data.fatherName,
                MotherName: data.motherName,
                SchoolID: data.schoolID,
                SchoolSection: data.schoolSection,
                StudentName: data.studentName,
                StudentNameHindi: data.studentNameHindi,
                StudentStandard: data.studentStandard,
                StudentClass: data.studentClass,
                StudentBloodGroup: data.studentBloodGroup,
                CountryID: data.countryID,
                Address1: data.address1,
                Address2: data.address2,
                CityID: data.cityID,
                Pincode: data.pincode,
                FatherMobileNumber: data.fatherMobileNumber,
                MotherMobileNumber: data.motherMobileNumber,
                OtherMobileNumber: data.otherMobileNumber,
                PrimaryMobileNumber: primaryMobileNumber,
                PrimaryMobileNumberOf: data.primaryMobileNumberOf,
                EmailID: data.emailID,
                FromRouteID: data.fromRouteID,
                ToRouteID: data.toRouteID,
                FromStoppageID: data.fromStoppageID,
                ToStoppageID: data.toStoppageID,
                ChakraviewCode: data.chakraviewCode,
                SchoolCode: data.schoolCode,
                isBan: "N",
                Year: data.year,
                isDeleted: "N",
                CreatedBy: "Admin",
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss"),
            });
        }

        if (!data.chakraviewCode) {
            await student.update({ ChakraviewCode: student.StudentID });
        };

        // Note -- we don't know the purpose of below code, just carring over from legacy code.
        const distanceConfigs = await DB_MODELS.CONFIGURE_DISTANCE_SMS.findAll({
            where: {
                BusOperatorID: busOperatorID,
                SchoolID: data.schoolID,
            },
        });

        if (distanceConfigs.length > 0) {
            for (const config of distanceConfigs) {
                const existingStandards = config.StudentStandard
                    ? config.StudentStandard.split(",")
                    : [];
                if (!existingStandards.includes(data.studentStandard)) {
                    existingStandards.push(data.studentStandard);
                    await config.update({
                        StudentStandard: existingStandards.join(","),
                    });
                }
            }
        }
        else {
            await DB_MODELS.CONFIGURE_DISTANCE_SMS.create({
                BusOperatorID: busOperatorID,
                SchoolID: data.schoolID,
                RouteType: 'Pickup',
                StudentStandard: data.studentStandard,
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss"),
            });
            await DB_MODELS.CONFIGURE_DISTANCE_SMS.create({
                BusOperatorID: busOperatorID,
                SchoolID: data.schoolID,
                RouteType: 'Drop',
                StudentStandard: data.studentStandard,
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss"),
            });
        }
    } catch (error) {
        throw error;
    }
};

const updateStudent = async (id, busOperatorID, data) => {
    try {
        let primaryMobileNumber;
        if (data.primaryMobileNumberOf === 'Father') {
            primaryMobileNumber = data.fatherMobileNumber;
        } else if (data.primaryMobileNumberOf === 'Mother') {
            primaryMobileNumber = data.motherMobileNumber;
        } else if (data.primaryMobileNumberOf === 'Other') {
            primaryMobileNumber = data.otherMobileNumber;
        };


        let student;
        if (data.pickupMonday !== undefined) {
            student = await DB_MODELS.STUDENT_MASTER.update({
                FatherName: data.fatherName,
                MotherName: data.motherName,
                SchoolID: data.schoolID,
                SchoolSection: data.schoolSection,
                StudentName: data.studentName,
                StudentNameHindi: data.studentNameHindi,
                StudentStandard: data.studentStandard,
                StudentClass: data.studentClass,
                StudentBloodGroup: data.studentBloodGroup,
                CountryID: data.countryID,
                Address1: data.address1,
                Address2: data.address2,
                CityID: data.cityID,
                isBan: data.isBan,
                Pincode: data.pincode,
                FatherMobileNumber: data.fatherMobileNumber,
                MotherMobileNumber: data.motherMobileNumber,
                OtherMobileNumber: data.otherMobileNumber,
                PrimaryMobileNumber: primaryMobileNumber,
                PrimaryMobileNumberOf: data.primaryMobileNumberOf,
                EmailID: data.emailID,
                FromRouteID: data.fromRouteID,
                ToRouteID: data.toRouteID,
                FromStoppageID: data.fromStoppageID,
                ToStoppageID: data.toStoppageID,
                ChakraviewCode: data.chakraviewCode,
                SchoolCode: data.schoolCode,
                PickupMonday: data.pickupMonday,
                PickupTuesday: data.pickupTuesday,
                PickupWednesday: data.pickupWednesday,
                PickupThursday: data.pickupThursday,
                PickupFriday: data.pickupFriday,
                PickupSaturday: data.pickupSaturday,
                PickupSunday: data.pickupSunday,
                DropMonday: data.dropMonday,
                DropTuesday: data.dropTuesday,
                DropWednesday: data.dropWednesday,
                DropThursday: data.dropThursday,
                DropFriday: data.dropFriday,
                DropSaturday: data.dropSaturday,
                DropSunday: data.dropSunday,
                StayBackToRouteID: data.stayBackToRouteID,
                StayBackDropMonday: data.stayBackDropMonday,
                StayBackDropTuesday: data.stayBackDropTuesday,
                StayBackDropWednesday: data.stayBackDropWednesday,
                StayBackDropThursday: data.stayBackDropThursday,
                StayBackDropFriday: data.stayBackDropFriday,
                StayBackDropSaturday: data.stayBackDropSaturday,
                StayBackDropSunday: data.stayBackDropSunday,
                isAttendance: data.isAttendance,
                Year: data.year,
                UpdatedBy: "Admin",
                UpdatedOn: moment().format("YYYY MM DD, h:mm:ss"),
            },
                { where: { StudentID: id } }
            );
        }
        else {
            student = await DB_MODELS.STUDENT_MASTER.update({
                FatherName: data.fatherName,
                MotherName: data.motherName,
                SchoolID: data.schoolID,
                SchoolSection: data.schoolSection,
                StudentName: data.studentName,
                StudentNameHindi: data.studentNameHindi,
                StudentStandard: data.studentStandard,
                StudentClass: data.studentClass,
                StudentBloodGroup: data.studentBloodGroup,
                CountryID: data.countryID,
                Address1: data.address1,
                Address2: data.address2,
                CityID: data.cityID,
                Pincode: data.pincode,
                FatherMobileNumber: data.fatherMobileNumber,
                MotherMobileNumber: data.motherMobileNumber,
                OtherMobileNumber: data.otherMobileNumber,
                PrimaryMobileNumber: primaryMobileNumber,
                PrimaryMobileNumberOf: data.primaryMobileNumberOf,
                EmailID: data.emailID,
                isBan: data.isBan,
                FromRouteID: data.fromRouteID,
                ToRouteID: data.toRouteID,
                FromStoppageID: data.fromStoppageID,
                ToStoppageID: data.toStoppageID,
                SchoolCode: data.schoolCode,
                Year: data.year,
                UpdatedBy: "Admin",
                UpdatedOn: moment().format("YYYY MM DD, h:mm:ss"),
            },
                { where: { StudentID: id }, logging: console.log }
            );
        }



        // Note -- we don't know the purpose of below code, just carring over from legacy code.
        const distanceConfigs = await DB_MODELS.CONFIGURE_DISTANCE_SMS.findAll({
            where: {
                BusOperatorID: busOperatorID,
                SchoolID: id,
            },
        });

        if (distanceConfigs.length > 0) {
            for (const config of distanceConfigs) {
                const existingStandards = config.StudentStandard
                    ? config.StudentStandard.split(",")
                    : [];
                if (!existingStandards.includes(data.studentStandard)) {
                    existingStandards.push(data.studentStandard);
                    await config.update({
                        StudentStandard: existingStandards.join(","),
                    });
                }
            }
        }
        else {
            await DB_MODELS.CONFIGURE_DISTANCE_SMS.create({
                BusOperatorID: busOperatorID,
                SchoolID: data.schoolID,
                RouteType: 'Pickup',
                StudentStandard: data.studentStandard,
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss"),
            });
            await DB_MODELS.CONFIGURE_DISTANCE_SMS.create({
                BusOperatorID: busOperatorID,
                SchoolID: data.schoolID,
                RouteType: 'Drop',
                StudentStandard: data.studentStandard,
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss"),
            });
        }

    } catch (error) {
        throw error;
    }
};

const deleteStudent = async (id) => {
    try {
        return await DB_MODELS.STUDENT_MASTER.update({
            isDeleted: 'Y',
        }, {
            where: { StudentID: id }
        })
    } catch (error) {
        throw error;
    }
};

const studentFeesUpdate = async (id, data) => {
    try {
        // let primaryMobileNumber;
        // if (data.primaryMobileNumberOf === 'Father') {
        //     primaryMobileNumber = data.fatherMobileNumber;
        // } else if (data.primaryMobileNumberOf === 'Mother') {
        //     primaryMobileNumber = data.motherMobileNumber;
        // } else if (data.primaryMobileNumberOf === 'Other') {
        //     primaryMobileNumber = data.otherMobileNumber;
        // };

        await DB_MODELS.STUDENT_MASTER.update({
            FatherName: data.fatherName,
            MotherName: data.motherName,
            SchoolID: data.schoolID,
            SchoolSection: data.schoolSection,
            StudentName: data.studentName,
            StudentNameHindi: data.studentNameHindi,
            StudentStandard: data.studentStandard,
            StudentClass: data.studentClass,
            StudentBloodGroup: data.studentBloodGroup,
            CountryID: data.countryID,
            Address1: data.address1,
            Address2: data.address2,
            AddressZone: data.addressZone,
            CityID: data.cityID,
            isBan: data.isBan,
            Pincode: data.pincode,
            FatherMobileNumber: data.fatherMobileNumber,
            MotherMobileNumber: data.motherMobileNumber,
            OtherMobileNumber: data.otherMobileNumber,
            // PrimaryMobileNumber: primaryMobileNumber,
            PrimaryMobileNumberOf: data.primaryMobileNumberOf,
            EmailID: data.emailID,
            FromRouteID: data.fromRouteID,
            ToRouteID: data.toRouteID,
            FromStoppageID: data.fromStoppageID,
            ToStoppageID: data.toStoppageID,
            ChakraviewCode: data.chakraviewCode,
            SchoolCode: data.schoolCode,
            PickupMonday: data.pickupMonday,
            PickupTuesday: data.pickupTuesday,
            PickupWednesday: data.pickupWednesday,
            PickupThursday: data.pickupThursday,
            PickupFriday: data.pickupFriday,
            PickupSaturday: data.pickupSaturday,
            PickupSunday: data.pickupSunday,
            DropMonday: data.dropMonday,
            DropTuesday: data.dropTuesday,
            DropWednesday: data.dropWednesday,
            DropThursday: data.dropThursday,
            DropFriday: data.dropFriday,
            DropSaturday: data.dropSaturday,
            DropSunday: data.dropSunday,
            StayBackToRouteID: data.stayBackToRouteID,
            StayBackDropMonday: data.stayBackDropMonday,
            StayBackDropTuesday: data.stayBackDropTuesday,
            StayBackDropWednesday: data.stayBackDropWednesday,
            StayBackDropThursday: data.stayBackDropThursday,
            StayBackDropFriday: data.stayBackDropFriday,
            StayBackDropSaturday: data.stayBackDropSaturday,
            StayBackDropSunday: data.stayBackDropSunday,
            isAttendance: data.isAttendance,
            Year: data.year,
            UpdatedBy: "Admin",
            UpdatedOn: moment().format("YYYY MM DD, h:mm:ss"),
        },
            { where: { StudentID: id } }
        );
    } catch (error) {
        throw error;
    }
};

const getStudentCount = async (busOperatorId) => {
    try {
        const whereConditionFees = {
            isDeleted: 'N',
            isBan: 'N',
            ...(busOperatorId && { BusOperatorID: busOperatorId }),
        };
        return await DB_MODELS.STUDENT_MASTER.count({
            where: whereConditionFees
        });
    } catch (error) {
        throw error;
    }
};

const getStudentListByNo = async (phoneNumber) => {
    try {
        return await DB_MODELS.STUDENT_MASTER.findAll({
            where: {
                [Op.or]: [
                    { FatherMobileNumber: phoneNumber },
                    { MotherMobileNumber: phoneNumber },
                    { OtherMobileNumber: phoneNumber },
                ],
                isDeleted: 'N'
            },
            attributes: ["StudentID", "StudentName", "Student_Img", "SchoolCode"],
            include: [
                {
                    model: DB_MODELS.SCHOOL_MASTER,
                    attributes: ["SchoolID", "SchoolName"],
                    where: { isDeleted: 'N' }
                },
                {
                    model: DB_MODELS.BUS_OPERATOR_MASTER,
                    attributes: ["BusOperatorName"],
                    where: { isDeleted: 'N' }
                },
            ],
        })
    } catch (error) {
        throw error;
    }
};

const getStudentPayFeeszon = async (studentID) => {
    try {
        return await DB_MODELS.STUDENT_MASTER.findAll({
            where: {
                StudentID: studentID,
                isDeleted: 'N'
            },
            attributes: ["StudentID", "FatherName", "Year", "MotherName", "SchoolSection", "StudentName", "StudentStandard", "StudentClass", "Address1", "Address2", "AddressZone", "Pincode", "FatherMobileNumber", "MotherMobileNumber", "OtherMobileNumber", "PrimaryMobileNumber", "PrimaryMobileNumberOf", "EmailID"],
            include: [
                {
                    model: DB_MODELS.SCHOOL_MASTER,
                    attributes: ["SchoolID", "SchoolName", "SchoolLogo", "terms_conditions"],
                    where: { isDeleted: 'N' }
                },
                {
                    model: DB_MODELS.BUS_OPERATOR_MASTER,
                    attributes: ["BusOperatorName", "PhoneNumber", "EmailID", "LogoImage"],
                    where: { isDeleted: 'N' }
                },
                {
                    model: DB_MODELS.COUNTRY_MASTER,
                    attributes: ["CountryName",]
                },
                {
                    model: DB_MODELS.CITY_MASTER,
                    attributes: ["CityName",]
                }
            ],
            raw: true
        })
    } catch (error) {
        throw error;
    }
};

const getPaneltyMessage = async (schoolID) => {
    try {
        return await DB_MODELS.STUDENT_FEES_PENALTY.findOne({
            attributes: ["penalty_amount", "message"],
            where: {
                school_id: schoolID,
            },
        })
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentCount,
    studentFeesUpdate,
    getStudentListByNo,
    getStudentPayFeeszon,
    getPaneltyMessage
};