const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const AllocationModel = require('./Allocation.model');

const MdmSimcardDetailsModel = sequelize_connection.define('mdm_simcard_details', {
    SimID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    CustID: {
        type: DataTypes.INTEGER
    },
    SimSerialNumber: {
        type: DataTypes.STRING
    },
    NetworkProvider: {
        type: DataTypes.STRING
    },
    SimType: {
        type: DataTypes.STRING
    },
    RechargeType: {
        type: DataTypes.STRING
    },
    PhoneNumber: {
        type: DataTypes.STRING
    },
    SIMNumber: {
        type: DataTypes.STRING
    },
    SIMPurchaseDate: {
        type: DataTypes.DATE
    },
    PostpaidPlanName: {
        type: DataTypes.STRING
    },
    PostpaidPlanRental: {
        type: DataTypes.STRING
    },
    PrepaidPlanName: {
        type: DataTypes.STRING
    },
    PrepaidRechargeDate: {
        type: DataTypes.STRING
    },
    PrepaidRechargeAmount: {
        type: DataTypes.STRING
    },
    SimStatus: {
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
    UpdatedBy: {
        type: DataTypes.STRING,
    },
    UpdatedOn: {
        type: DataTypes.DATE,
    }

}, {
    tableName: 'mdm_simcard_details',
    timestamps: false
});

MdmSimcardDetailsModel.belongsTo(AllocationModel, { foreignKey: 'SimSerialNumber', targetKey: 'SimSerialNumber' });
module.exports = MdmSimcardDetailsModel;

