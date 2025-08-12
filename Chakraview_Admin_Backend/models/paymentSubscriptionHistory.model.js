const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const SchoolMasterModel = require('./schoolMaster.model');
const StudentMasterModel = require('./studentMaster.model');

const PaymentSubscriptionHistory = sequelize_connection.define('payment_subscription_history', {
    Subno: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    SubID: {
        type: DataTypes.INTEGER
    },
    PlanId: {
        type: DataTypes.INTEGER
    },
    SNo: {
        type: DataTypes.INTEGER
    },
    StudentID: {
        type: DataTypes.INTEGER
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    amount: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.INTEGER
    },
    initiatedt: {
        type: DataTypes.DATE
    },
    statusdt: {
        type: DataTypes.DATE
    },
    name: {
        type: DataTypes.STRING
    },
    txnid: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    productinfo: {
        type: DataTypes.STRING
    },
    extras: {
        type: DataTypes.STRING
    },
}, {
    tableName: 'payment_subscription_history',
    timestamps: false
});
// Association to SchoolMasterModel
PaymentSubscriptionHistory.belongsTo(SchoolMasterModel, {
  foreignKey: 'SchoolID', 
  as: 'school_master',   
});
PaymentSubscriptionHistory.belongsTo(StudentMasterModel, {
  foreignKey: 'StudentID',
  as: 'student_master',    
});
module.exports = PaymentSubscriptionHistory;