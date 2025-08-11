// const RedisClient = require('../configs/redis.config');
const { DB_MODELS } = require('../constants/models.constant');
const moment = require("moment");
const dbService = require('./db.service');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const getFeesMasterStudentwise = async (busOperatorId) => {
    try {
        const selFeesConfigurationData = await DB_MODELS.FEES_MASTER.findAll({
            attributes: ["FeesID", "StudentID", "Currency", "FeesAmount", "ChakraviewCode", "FirstInstallment", "SecondInstallment", "ThirdInstallment", "FourthInstallment", "DueDateForFirstInstallment", "DueDateForSecondInstallment", "DueDateForThirdInstallment", "DueDateForFourthInstallment"],
            where: { BusOperatorID: busOperatorId, isDeleted: 'N' },
            include: [
                {
                    model: DB_MODELS.SCHOOL_MASTER,
                    required: true,
                    attributes: ['SchoolName'],
                },
                {
                    model: DB_MODELS.STUDENT_MASTER,
                    where: { isDeleted: 'N' },
                    required: true,
                    attributes: ["StudentName", "SchoolCode", "ChakraviewCode", "StudentStandard", "StudentClass", "FatherName", "MotherName", "PrimaryMobileNumber", "AddressZone",]
                }
            ],
        });

        const result = [];
        for (let index = 0; index < selFeesConfigurationData.length; index++) {
            let data = selFeesConfigurationData[index];
            let paidAmountFirst = 0;
            let paidAmountSecond = 0;
            let paidAmountThird = 0;
            let paidAmountFourth = 0;

            const selPaidFeesData = await DB_MODELS.FEES_COLLECTION.findAll({
                attributes: ["InstallmentName", "PaidAmount"],
                where: {
                    FeesID: data.FeesID,
                    isDeleted: 'N',
                }
            });

            for (let payment of selPaidFeesData) {
                if (payment.InstallmentName === "FirstInstallment") {
                    paidAmountFirst += payment.PaidAmount;
                } else if (payment.InstallmentName === "SecondInstallment") {
                    paidAmountSecond += payment.PaidAmount;
                } else if (payment.InstallmentName === "ThirdInstallment") {
                    paidAmountThird += payment.PaidAmount;
                } else if (payment.InstallmentName === "FourthInstallment") {
                    paidAmountFourth += payment.PaidAmount;
                };
            };

            let firstInstallmentRemaining = 0;
            let secondInstallmentRemaining = 0;
            let thirdInstallmentRemaining = 0;
            let fourthInstallmentRemaining = 0;

            if (data.FirstInstallment != 0) {
                firstInstallmentRemaining = data.FirstInstallment - paidAmountFirst;
            }
            if (data.SecondInstallment != 0) {
                secondInstallmentRemaining = data.SecondInstallment - paidAmountSecond;
            }
            if (data.ThirdInstallment != 0) {
                thirdInstallmentRemaining = data.ThirdInstallment - paidAmountThird;
            }
            if (data.FourthInstallment != 0) {
                fourthInstallmentRemaining = data.FourthInstallment - paidAmountFourth;
            };

            result.push({
                feesID: data.FeesID,
                schoolName: data.school_master?.SchoolName || "",
                schoolCode: data.student_master?.SchoolCode || "",
                chakraviewCode: data.ChakraviewCode,
                studentId: data.StudentID,
                studentName: data.student_master?.StudentName || "",
                studentStandard: data.student_master?.StudentStandard || "",
                studentClass: data.student_master?.StudentClass || "",
                fatherName: data.student_master?.FatherName || "",
                motherName: data.student_master?.MotherName || "",
                primaryMobileNumber: data.student_master?.PrimaryMobileNumber || "",
                addressZone: data.student_master?.AddressZone || "",
                feesAmount: data.FeesAmount,
                chakraviewCode: data.ChakraviewCode,
                currency: data.Currency,
                feesAmount: data.FeesAmount,
                firstInstallment: data.FirstInstallment,
                secondInstallment: data.SecondInstallment,
                thirdInstallment: data.ThirdInstallment,
                fourthInstallment: data.FourthInstallment,
                dueDateForFirstInstallment: data.DueDateForFirstInstallment || "",
                dueDateForSecondInstallment: data.DueDateForSecondInstallment || "",
                dueDateForThirdInstallment: data.DueDateForThirdInstallment || "",
                dueDateForFourthInstallment: data.DueDateForFourthInstallment || "",
                paidFirstInstallment: paidAmountFirst,
                paidSecondInstallment: paidAmountSecond,
                paidThirdInstallment: paidAmountThird,
                paidFourthInstallment: paidAmountFourth,
                firstInstallmentRemaining: firstInstallmentRemaining,
                secondInstallmentRemaining: secondInstallmentRemaining,
                thirdInstallmentRemaining: thirdInstallmentRemaining,
                fourthInstallmentRemaining: fourthInstallmentRemaining,
            });

        };
        return result;

    } catch (error) {
        throw error;
    }
};

const createFeesMasterStudentwise = async (data, busOperatorID) => {
    try {
        const installments = data.installments || [];

        let firstInstallment = 0, secondInstallment = 0, thirdInstallment = 0, fourthInstallment = 0;
        let firstDueDate = null, secondDueDate = null, thirdDueDate = null, fourthDueDate = null;

        for (let i = 0; i < installments.length; i++) {
            const inst = installments[i];

            if (inst.first !== undefined) {
                firstInstallment = inst.first;
                firstDueDate = inst.dueDate;
            } else if (inst.second !== undefined) {
                secondInstallment = inst.second;
                secondDueDate = inst.dueDate;
            } else if (inst.third !== undefined) {
                thirdInstallment = inst.third;
                thirdDueDate = inst.dueDate;
            } else if (inst.fourth !== undefined) {
                fourthInstallment = inst.fourth;
                fourthDueDate = inst.dueDate;
            }
        }

        return await DB_MODELS.FEES_MASTER.create({
            BusOperatorID: busOperatorID,
            SchoolID: data.SchoolID,
            StudentID: data.StudentID,
            ChakraviewCode: data.ChakraviewCode,
            SchoolCode: data.SchoolCode,
            AddressZone: data.AddressZone,
            Currency: "INR",
            FeesAmount: data.TotalFees,
            FirstInstallment: firstInstallment,
            SecondInstallment: secondInstallment,
            ThirdInstallment: thirdInstallment,
            FourthInstallment: fourthInstallment,
            DueDateForFirstInstallment: firstDueDate,
            DueDateForSecondInstallment: secondDueDate,
            DueDateForThirdInstallment: thirdDueDate,
            DueDateForFourthInstallment: fourthDueDate,
            isDeleted: 'N',
            CreatedBy: "Admin",
            CreatedOn: moment().format("YYYY MM DD, h:mm:ss"),
            UpdatedBy: "Admin",
            UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
        });

    } catch (error) {
        throw error;
    }
};

const updateFeesMasterStudentwise = async (id, data) => {
    try {
        const installments = data.installments || [];

        let firstInstallment = 0, secondInstallment = 0, thirdInstallment = 0, fourthInstallment = 0;
        let firstDueDate = null, secondDueDate = null, thirdDueDate = null, fourthDueDate = null;

        for (let inst of installments) {
            if (inst.first !== undefined) {
                firstInstallment = inst.first;
                firstDueDate = inst.dueDate;
            } else if (inst.second !== undefined) {
                secondInstallment = inst.second;
                secondDueDate = inst.dueDate;
            } else if (inst.third !== undefined) {
                thirdInstallment = inst.third;
                thirdDueDate = inst.dueDate;
            } else if (inst.fourth !== undefined) {
                fourthInstallment = inst.fourth;
                fourthDueDate = inst.dueDate;
            }
        }

        return await DB_MODELS.FEES_MASTER.update({
            SchoolID: data.SchoolID,
            StudentID: data.StudentID,
            ChakraviewCode: data.ChakraviewCode,
            SchoolCode: data.SchoolCode,
            AddressZone: data.AddressZone,
            Currency: "INR",
            FeesAmount: data.TotalFees,
            FirstInstallment: firstInstallment,
            SecondInstallment: secondInstallment,
            ThirdInstallment: thirdInstallment,
            FourthInstallment: fourthInstallment,
            DueDateForFirstInstallment: firstDueDate,
            DueDateForSecondInstallment: secondDueDate,
            DueDateForThirdInstallment: thirdDueDate,
            DueDateForFourthInstallment: fourthDueDate,
            UpdatedBy: "Admin",
            UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
        }, {
            where: { FeesID: id }
        });

        ;
    } catch (error) {
        throw error;
    }
};

const deleteFeesMasterStudentwise = async (id) => {
    try {
        return await DB_MODELS.FEES_MASTER.update({
            isDeleted: 'Y',
        }, {
            where: { FeesID: id }
        })
    } catch (error) {
        throw error;
    }
};



module.exports = {
    getFeesMasterStudentwise,
    createFeesMasterStudentwise,
    updateFeesMasterStudentwise,
    deleteFeesMasterStudentwise,
};