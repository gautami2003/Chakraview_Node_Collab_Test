const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const StudentSubscriptionMaster = sequelize_connection.define('student_subscription_master', {
    SubscriptionID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    StudentID: {
        type: DataTypes.INTEGER
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    BusOperatorID: {
        type: DataTypes.STRING
    },
    PlanID: {
        type: DataTypes.INTEGER
    },
    FromDate: {
        type: DataTypes.DATE
    },
    ToDate: {
        type: DataTypes.DATE
    },
    PaidBy: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.STRING
    },
    paymentid: {
        type: DataTypes.INTEGER
    },

}, {
    tableName: 'student_subscription_master',
    timestamps: false
});



module.exports = StudentSubscriptionMaster;