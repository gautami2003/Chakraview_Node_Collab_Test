const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const SchoolMasterModel = require('./schoolMaster.model');

const FeesMasterZonewisModel = sequelize_connection.define('fees_master_zonewise', {
    FeesID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
    Monthly_Period: {
        type: DataTypes.STRING
    },
    Monthly_Amount: {
        type: DataTypes.INTEGER
    },
    Quarterly_Period: {
        type: DataTypes.STRING
    },
    Quarterly_Amount: {
        type: DataTypes.INTEGER
    },
    Quadrimester_Period: {
        type: DataTypes.STRING
    },
    Quadrimester_Amount: {
        type: DataTypes.INTEGER
    },
    Annual_Period: {
        type: DataTypes.STRING
    },
    Annual_Amount: {
        type: DataTypes.INTEGER
    },
    SemiAnnual_Period: {
        type: DataTypes.STRING
    },
    SemiAnnual_Amount: {
        type: DataTypes.INTEGER
    },
    duedateForPayment: {
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
        type: DataTypes.STRING
    },
    UpdatedOn: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'fees_master_zonewise',
    timestamps: false
});

FeesMasterZonewisModel.belongsTo(SchoolMasterModel, { foreignKey: 'SchoolID' });

module.exports = FeesMasterZonewisModel;