const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const StudentMasterModel = require('./studentMaster.model');

const FeesCollectionZonewiseModel = sequelize_connection.define('fees_collection_zonewise', {
    FeesID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    StudentID: {
        type: DataTypes.INTEGER
    },
    SchoolCode: {
        type: DataTypes.STRING
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    SchoolName: {
        type: DataTypes.STRING
    },
    AddressZone: {
        type: DataTypes.STRING
    },
    Currency: {
        type: DataTypes.STRING
    },
    TotalFeesPaidAmount: {
        type: DataTypes.INTEGER
    },
    Gross_Amount: {
        type: DataTypes.INTEGER
    },
    EmailIDForPayment: {
        type: DataTypes.STRING
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
    TxnIDFromPG: {
        type: DataTypes.STRING
    },
    order_id: {
        type: DataTypes.STRING
    },
    payment_gateway_response: {
        type: DataTypes.JSON
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
    UpdatedBy: {
        type: DataTypes.STRING
    },
    UpdatedOn: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'fees_collection_zonewise',
    timestamps: false
});

FeesCollectionZonewiseModel.belongsTo(StudentMasterModel, { foreignKey: 'StudentID' });

module.exports = FeesCollectionZonewiseModel;