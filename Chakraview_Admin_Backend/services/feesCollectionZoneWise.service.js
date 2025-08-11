// const RedisClient = require('../configs/redis.config');
const { DB_MODELS } = require('../constants/models.constant');
const moment = require("moment");
const dbService = require('./db.service');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const getFeesCollectionZoneWise = async (data, busOperatorId, page, limit) => {
    try {
        const offset = (page - 1) * limit;
        const whereConditionFees = {
            BusOperatorID: busOperatorId,
            isDeleted: "N",
            ...(data.schoolID && { SchoolID: data.schoolID }),
        };
        const whereConditionSchool = {
            ...(data.studentYear && { Year: data.studentYear }),
        };

        const getFeesCollection = await DB_MODELS.FEES_COLLECTION_ZONEWIS.findAndCountAll({
            attributes: ["FeesID", "SchoolName", "StudentID", "SchoolID", "Currency", "Gross_Amount", "PaymentDate", "ToalFeesPaidAmount", "ModeOfPayment"],
            where: whereConditionFees,
            include: [
                {
                    model: DB_MODELS.STUDENT_MASTER,
                    attributes: ["StudentName", "StudentStandard", "StudentClass", "FatherName", "MotherName", "PrimaryMobileNumber"],
                    where: whereConditionSchool
                },
            ],
            limit: limit,
            offset: offset,
            order: [["PaymentDate", "DESC"]]
        })
        let result = [];
        for (let data of getFeesCollection.rows) {
            const getPaidFeesData = await DB_MODELS.STUDENT_MASTER.findOne({
                attributes: ["AddressZone", "Address1", "Address2", "FromRouteID", "ToRouteID"],
                where: {
                    BusOperatorID: busOperatorId,
                    isDeleted: "N",
                    SchoolID: data.SchoolID,
                    StudentID: data.StudentID
                },
                include: [
                    {
                        model: DB_MODELS.PICKUP_ROUTE_MASTER,
                        attributes: ["RouteName"]
                    },
                    {
                        model: DB_MODELS.DROP_ROUTE_MASTER,
                        attributes: ["RouteName"]
                    },
                ],
            });
            result.push({
                feesID: data.FeesID || "",
                schoolName: data.SchoolName || "",
                studentID: data.StudentID || "",
                studentName: data?.student_master?.StudentName || "",
                studentStandard: data?.student_master?.StudentStandard || "",
                studentClass: data?.student_master?.StudentClass || "",
                fatherName: data?.student_master?.FatherName || "",
                motherName: data?.student_master?.MotherName || "",
                primaryMobileNumber: data?.student_master?.PrimaryMobileNumber || "",
                address1: getPaidFeesData?.Address1 || "",
                address2: getPaidFeesData?.Address2 || "",
                addressZone: getPaidFeesData?.AddressZone || "",
                pickupRouteName: getPaidFeesData?.pickup_route_master?.RouteName || "",
                dropRouteName: getPaidFeesData?.drop_route_master?.RouteName || "",
                currency: data.Currency || "",
                gross_Amount: data.Gross_Amount || "",
                modeOfPayment: data.ModeOfPayment || "",
                paymentDate: data.PaymentDate || "",
                toalFeesPaidAmount: data.ToalFeesPaidAmount || "",
            });

        }
        let totalGrossAmount = await DB_MODELS.FEES_COLLECTION_ZONEWIS.sum("Gross_Amount", {
            where: whereConditionFees
        });
        let totalPaidAmount = await DB_MODELS.FEES_COLLECTION_ZONEWIS.sum("ToalFeesPaidAmount", {
            where: whereConditionFees,
        });
        return {
            count: getFeesCollection.count,
            totalGrossAmount: totalGrossAmount,
            totalPaidAmount: totalPaidAmount,
            rows: result,
        };

    } catch (error) {
        throw error;
    }
};

const createFeesCollectionZoneWise = async (data, busOperatorID) => {
    try {
        const createFeesCollection = await DB_MODELS.FEES_COLLECTION_ZONEWIS.create({
            BusOperatorID: busOperatorID,
            SchoolID: data.SchoolID,
            SchoolName: data.SchoolName,
            StudentID: data.StudentID,
            SchoolCode: data.SchoolCode,
            Currency: "INR",
            TotalFeesPaidAmount: data.TotalFeesPaidAmount,
            Gross_Amount: data.Gross_Amount,
            EmailIDForPayment: data.EmailIDForPayment,
            PaymentDate: data.PaymentDate,
            ModeOfPayment: data.ModeOfPayment,
            CheckOrRefNumber: data.CheckOrRefNumber,
            NameOfBank: data.NameOfBank,
            Remarks: data.Remarks,
            TxnIDFromPG: data.TxnIDFromPG,
            order_id: data.order_id,
            payment_gateway_response: data.payment_gateway_response,
            isDeleted: "N",
            CreatedBy: "Admin",
            CreatedOn: moment().format("YYYY MM DD, h:mm:ss"),
            UpdatedBy: "Admin",
            UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")

        })
        if (createFeesCollection) {
            return true
        }
        return false

    } catch (error) {
        throw error;
    }
};

const updateFeesCollectionZoneWise = async (id, data) => {
    try {
        const updateFeesCollection = await DB_MODELS.FEES_COLLECTION_ZONEWIS.update({
            SchoolID: data.SchoolID,
            SchoolName: data.SchoolName,
            TotalFeesPaidAmount: data.TotalFeesPaidAmount,
            Gross_Amount: data.Gross_Amount,
            EmailIDForPayment: data.EmailIDForPayment,
            UpdatedBy: "Admin",
            UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
        },
            { where: { FeesID: id, } }
        )
        if (updateFeesCollection) {
            return true
        }
        return false

    } catch (error) {
        throw error;
    }
};

const deleteFeesCollectionZoneWise = async (id) => {
    try {
        return await DB_MODELS.FEES_COLLECTION_ZONEWIS.update({
            isDeleted: 'Y',
        }, {
            where: { FeesID: id, }
        })
    } catch (error) {
        throw error;
    }
};


module.exports = {
    getFeesCollectionZoneWise,
    createFeesCollectionZoneWise,
    updateFeesCollectionZoneWise,
    deleteFeesCollectionZoneWise,
};