const { DB_MODELS } = require('../constants/models.constant');;
const moment = require("moment");

const getAllFees = async (modeOfPayment, busOperatorID, page, limit) => {
    try {
        const offset = (page - 1) * limit;
        const result = await DB_MODELS.FEES_MASTER.findAndCountAll({
            where: {
                BusOperatorID: busOperatorID,
                isDeleted: 'N'
            },
            attributes: [
                "FeesID",
                "FeesAmount",
                "AddressZone",
                "Currency",
                "FirstInstallment",
                "SecondInstallment",
                "ThirdInstallment",
                "FourthInstallment"
            ],
            include: [
                {
                    model: DB_MODELS.SCHOOL_MASTER,
                    as: 'school_master',
                    attributes: ["SchoolName"]
                },
                {
                    model: DB_MODELS.STUDENT_MASTER,
                    as: 'student_master',
                    attributes: [
                        "SchoolCode",
                        "StudentName",
                        "StudentStandard",
                        "StudentClass",
                        "FatherName",
                        "MotherName",
                        "PrimaryMobileNumber"
                    ]
                },
                {
                    model: DB_MODELS.FEES_COLLECTION,
                    as: 'fees_collection',
                    attributes: [
                        "InstallmentName",
                        "PaidAmount",
                        "PaymentDate",
                        "ModeOfPayment"
                    ],
                    where: modeOfPayment ? { modeOfPayment } : undefined
                }
            ],
            limit: limit,
            offset: offset,
        });

        let rows = [];

        for (const data of result.rows) {
            const student = data.student_master || {};
            const school = data.school_master || {};
            const feeCollected = data.fees_collection || {};

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
            console.log(selPaidFeesData, "selPaidFeesDataselPaidFeesDataselPaidFeesDataselPaidFeesData");
            let totalPaideFees = 0;

            for (let payment of selPaidFeesData) {
                if (payment.InstallmentName === "FirstInstallment") {
                    paidAmountFirst = payment.PaidAmount;
                    totalPaideFees += payment.PaidAmount;
                } else if (payment.InstallmentName === "SecondInstallment") {
                    paidAmountSecond = payment.PaidAmount;
                    totalPaideFees += payment.PaidAmount;
                } else if (payment.InstallmentName === "ThirdInstallment") {
                    paidAmountThird = payment.PaidAmount;
                    totalPaideFees += payment.PaidAmount;
                } else if (payment.InstallmentName === "FourthInstallment") {
                    paidAmountFourth = payment.PaidAmount;
                    totalPaideFees += payment.PaidAmount;
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
            // let totalPaideFees = paidAmountFirst + paidAmountSecond + paidAmountThird + paidAmountFourth;
            rows.push({
                feesid: data.FeesID,
                SchoolStudentCode: student.SchoolCode,
                School: school.SchoolName,
                FatherName: student.FatherName,
                MotherName: student.MotherName,
                PrimaryMobileNumber: student.PrimaryMobileNumber,
                StudentName: student.StudentName,
                Standard: student.StudentStandard,
                Class: student.StudentClass,
                AddressZone: data.AddressZone,
                Currency: data.Currency,
                TotalFees: data.FeesAmount,
                First: data.FirstInstallment,
                Second: data.SecondInstallment,
                Third: data.ThirdInstallment,
                Fourth: data.FourthInstallment,
                FeesCollected: feeCollected.PaidAmount,
                PaymentDate: feeCollected.PaymentDate,
                PaidAmountFirst: paidAmountFirst,
                PaidAmountSecond: paidAmountSecond,
                PaidAmountThird: paidAmountThird,
                PaidAmountFourth: paidAmountFourth,
                ModeOfPayment: feeCollected.ModeOfPayment,
                FirstInstallmentRemaining: firstInstallmentRemaining,
                SecondInstallmentRemaining: secondInstallmentRemaining,
                ThirdInstallmentRemaining: thirdInstallmentRemaining,
                FourthInstallmentRemaining: fourthInstallmentRemaining,
                totalPaideFees: totalPaideFees
            });
        };
        return {
            count: result.count,
            rows,
        };
    } catch (error) {
        throw error;
    }
};

const createFeesCollection = async (data) => {
    try {
        const result = await DB_MODELS.FEES_COLLECTION.create({
            FeesID: data.FeesID,
            SchoolCode: data.SchoolCode,
            InstallmentName: data.InstallmentName,
            PaidAmount: data.PaidAmount,
            PaymentDate: data.PaymentDate,
            ModeOfPayment: data.ModeOfPayment,
            CheckOrRefNumber: data.CheckOrRefNumber,
            NameOfBank: data.NameOfBank,
            Remarks: data.Remarks,
            EmailIDForPayment: data.EmailIDForPayment,
            HasRequestedToPG: data.HasRequestedToPG,
            StatusFromPG: data.StatusFromPG,
            TxnIDFromPG: data.TxnIDFromPG,
            isDeleted: "N",
            CreatedBy: "Admin",
            CreatedOn: moment().format("YYYY-MM-DD HH:mm:ss"),
        });

        if (result) {
            return true
        };
        return false
    }
    catch (error) {
        throw error;
    }
}

const deleteFeesCollection = async (id) => {
    try {
        return await DB_MODELS.FEES_COLLECTION.update({
            isDeleted: 'Y',
        }, {
            where: { FeesCollectionID: id }
        })
    }
    catch (error) {
        throw error;
    }
};

const updateFeesCollection = async (id, data) => {
    try {
        return await DB_MODELS.FEES_COLLECTION.update({
            FeesID: data.FeesID,
            SchoolCode: data.SchoolCode,
            InstallmentName: data.InstallmentName,
            PaidAmount: data.PaidAmount,
            PaymentDate: data.PaymentDate,
            ModeOfPayment: data.ModeOfPayment,
            CheckOrRefNumber: data.CheckOrRefNumber,
            NameOfBank: data.NameOfBank,
            Remarks: data.Remarks,
            EmailIDForPayment: data.EmailIDForPayment,
            HasRequestedToPG: data.HasRequestedToPG,
            StatusFromPG: data.StatusFromPG,
            TxnIDFromPG: data.TxnIDFromPG,
            isDeleted: "N",
            CreatedBy: "Admin",
            CreatedOn: moment().format("YYYY-MM-DD HH:mm:ss")
        },
            {
                where: { FeesCollectionID: id }
            }
        );
    }
    catch (error) {
        throw error;
    }
};

module.exports = {
    getAllFees,
    createFeesCollection,
    deleteFeesCollection,
    updateFeesCollection
};