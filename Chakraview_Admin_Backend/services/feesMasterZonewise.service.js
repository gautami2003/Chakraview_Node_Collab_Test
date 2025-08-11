// const RedisClient = require('../configs/redis.config');
const { DB_MODELS } = require('../constants/models.constant');
const moment = require("moment");
const dbService = require('./db.service');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const getFeesMasterZonewise = async (busOperatorId) => {
    try {
        return await DB_MODELS.FEES_MASTER_ZONEWIS.findAll({
            attributes: ["FeesID", "SchoolID", "AddressZone", "Currency", "Monthly_Period", "Monthly_Amount", "Quarterly_Period", "Quarterly_Amount", "Quadrimester_Amount", "Quadrimester_Period", "Annual_Period", "Annual_Amount", "SemiAnnual_Period", "SemiAnnual_Amount", "duedateForPayment"],
            where: { BusOperatorID: busOperatorId, isDeleted: 'N' },
            include: [
                {
                    model: DB_MODELS.SCHOOL_MASTER,
                    attributes: ["SchoolName",]
                },
            ],
        })
    } catch (error) {
        throw error;
    }
};

const createFeesMasterZonewise = async (data, busOperatorID) => {
    try {
        const getSchool = await DB_MODELS.SCHOOL_MASTER.findOne({
            attributes: ["SchoolName"],
            where: { SchoolID: data.schoolID }
        });
        const createFeesMaster = await DB_MODELS.FEES_MASTER_ZONEWIS.create({
            BusOperatorID: busOperatorID,
            SchoolID: data.schoolID,
            SchoolName: getSchool.SchoolName,
            AddressZone: data.addressZone,
            Currency: "INR",
            Monthly_Period: data.monthly_Period,
            Quarterly_Period: data.quarterly_Period,
            Annual_Period: data.annual_Period,
            SemiAnnual_Period: data.semiAnnual_Period,
            Quadrimester_Period: data.quadrimester_Period,
            Monthly_Amount: data.monthly_Amount,
            Quarterly_Amount: data.quarterly_Amount,
            Annual_Amount: data.annual_Amount,
            SemiAnnual_Amount: data.semiAnnual_Amount,
            Quadrimester_Amount: data.quadrimester_Amount,
            duedateForPayment: data.duedateForPayment,
            isDeleted: "N",
            CreatedBy: "Admin",
            CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
        });
        if (createFeesMaster) {
            return true
        };
        return false


    } catch (error) {
        throw error;
    }
};

const updateFeesMasterZonewise = async (id, data) => {
    try {
        const getSchool = await DB_MODELS.SCHOOL_MASTER.findOne({
            attributes: ["SchoolName"],
            where: { SchoolID: data.schoolID }
        });
        const updateFeesMaster = await DB_MODELS.FEES_MASTER_ZONEWIS.update({
            SchoolID: data.schoolID,
            SchoolName: getSchool.SchoolName,
            AddressZone: data.addressZone,
            Monthly_Period: data.monthly_Period,
            Monthly_Amount: data.monthly_Amount,
            Quarterly_Period: data.quarterly_Period,
            Quarterly_Amount: data.quarterly_Amount,
            Annual_Period: data.annual_Period,
            Annual_Amount: data.annual_Amount,
            SemiAnnual_Period: data.semiAnnual_Period,
            SemiAnnual_Amount: data.semiAnnual_Amount,
            Quadrimester_Period: data.quadrimester_Period,
            Quadrimester_Amount: data.quadrimester_Amount,
            duedateForPayment: data.duedateForPayment,
            UpdatedBy: "Admin",
            UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
        }, { where: { FeesID: id } });
        if (updateFeesMaster) {
            return true
        };
        return false

    } catch (error) {
        throw error;
    }
};

const deletefeesMasterZonewise = async (id) => {
    try {
        return await DB_MODELS.FEES_MASTER_ZONEWIS.update({
            isDeleted: 'Y',
        }, {
            where: { FeesID: id }
        })
    } catch (error) {
        throw error;
    }
};

const getAddressZone = async (schoolID) => {
    try {
        return await DB_MODELS.FEES_MASTER_ZONEWIS.findAll({
            attributes: ["FeesID", "AddressZone"],
            where: { SchoolID: schoolID, isDeleted: 'N' }, order: ['AddressZone'],
        })
    } catch (error) {
        throw error;
    }
};

const getPaymentFrequency = async (schoolID, addressZon) => {
    try {
        return await DB_MODELS.FEES_MASTER_ZONEWIS.findOne({
            attributes: ["FeesID", "Monthly_Period", "Monthly_Amount", "Quarterly_Period", "Quarterly_Amount", "Quadrimester_Amount", "Quadrimester_Period", "Annual_Period", "Annual_Amount", "SemiAnnual_Period", "SemiAnnual_Amount"],
            where: { SchoolID: schoolID, AddressZone: addressZon, isDeleted: 'N' }
        })
    } catch (error) {
        throw error;
    }
};

const paymentFrequencyDropDown = async (schoolID, addressZon) => {
    try {
        return await DB_MODELS.FEES_MASTER_ZONEWIS.findOne({
            attributes: ["FeesID", "Monthly_Period", "Monthly_Amount", "Quarterly_Period", "Quarterly_Amount", "Quadrimester_Amount", "Quadrimester_Period", "Annual_Period", "Annual_Amount", "SemiAnnual_Period", "SemiAnnual_Amount"],
            where: { SchoolID: schoolID, AddressZone: addressZon, isDeleted: 'N' }
        })
    } catch (error) {
        throw error;
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