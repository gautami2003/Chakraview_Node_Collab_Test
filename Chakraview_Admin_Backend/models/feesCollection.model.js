const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const SchoolMasterModel = require('./schoolMaster.model');
const StudentMasterModel = require('./studentMaster.model');

const FeesCollectionModel = sequelize_connection.define('fees_collection', {
    FeesCollectionID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    FeesID: {
        type: DataTypes.INTEGER
    },
    SchoolCode: {
        type: DataTypes.STRING
    },
    InstallmentName: {
        type: DataTypes.STRING
    },
    PaidAmount: {
        type: DataTypes.INTEGER
    },
    PaymentDate: {
        type: DataTypes.DATE
    },
    ModeOfPayment: {
        type: DataTypes.STRING
    },
    CheckOrRefNumber: {
        type: DataTypes.STRING
    },
    NameOfBank: {
        type: DataTypes.STRING
    },
    Remarks: {
        type: DataTypes.STRING
    },
    EmailIDForPayment: {
        type: DataTypes.STRING
    },
    HasRequestedToPG: {
        type: DataTypes.STRING
    },
    StatusFromPG: {
        type: DataTypes.STRING
    },
    TxnIDFromPG: {
        type: DataTypes.STRING
    },
    isDeleted: {
        type: DataTypes.STRING
    },
    CreatedBy: {
        type: DataTypes.STRING
    },
    CreatedOn: {
        type: DataTypes.DATE
    },
    PGResponse: {
        type: DataTypes.JSON
    }
}, {
    tableName: 'fees_collection',
    timestamps: false
});


module.exports = FeesCollectionModel;