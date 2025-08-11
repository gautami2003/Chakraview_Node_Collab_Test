const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const SchoolMasterModel = require('./schoolMaster.model');
const StudentMasterModel = require('./studentMaster.model');
const BusOperatorMasterModel = require('./busOperatorMaster.model');
const FeesCollectionModel = require('./feesCollection.model');

const FeesMasterModel = sequelize_connection.define('fees_master', {
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
    ChakraviewCode: {
        type: DataTypes.STRING
    },
    SchoolCode: {
        type: DataTypes.STRING
    },
    StudentID: {
        type: DataTypes.INTEGER
    },
    AddressZone: {
        type: DataTypes.STRING
    },
    Currency: {
        type: DataTypes.STRING
    },
    FeesAmount: {
        type: DataTypes.INTEGER
    },
    FirstInstallment: {
        type: DataTypes.INTEGER
    },
    SecondInstallment: {
        type: DataTypes.INTEGER
    },
    ThirdInstallment: {
        type: DataTypes.INTEGER
    },
    FourthInstallment: {
        type: DataTypes.INTEGER
    },
    DueDateForFirstInstallment: {
        type: DataTypes.DATE
    },
    DueDateForSecondInstallment: {
        type: DataTypes.DATE
    },
    DueDateForThirdInstallment: {
        type: DataTypes.DATE
    },
    DueDateForFourthInstallment: {
        type: DataTypes.DATE
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
    tableName: 'fees_master',
    timestamps: false
});

FeesMasterModel.belongsTo(SchoolMasterModel, { foreignKey: 'SchoolID' });
FeesMasterModel.belongsTo(StudentMasterModel, { foreignKey: 'SchoolCode', targetKey: 'SchoolCode' });

FeesMasterModel.belongsTo(BusOperatorMasterModel, { foreignKey: 'BusOperatorID' });
FeesMasterModel.belongsTo(FeesCollectionModel, { foreignKey: 'FeesID', targetKey: 'FeesID' });

module.exports = FeesMasterModel;