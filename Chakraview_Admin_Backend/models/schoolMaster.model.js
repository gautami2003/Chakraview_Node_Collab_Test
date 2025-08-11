const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const CountryMaster = require('./countryMaster.model');
const CityMasterModel = require('./cityMaster.model');

const SchoolMasterModel = sequelize_connection.define('school_master', {
    SchoolID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    SchoolName: {
        type: DataTypes.STRING
    },
    CountryID: {
        type: DataTypes.INTEGER
    },
    Address1: {
        type: DataTypes.STRING
    },
    Address2: {
        type: DataTypes.STRING
    },
    CityID: {
        type: DataTypes.INTEGER
    },
    Pincode: {
        type: DataTypes.STRING
    },
    PrePrimarySectionInchargeName: {
        type: DataTypes.STRING
    },
    PrePrimarySectionInchargeNumber: {
        type: DataTypes.STRING
    },
    PrimarySectionInchargeName: {
        type: DataTypes.STRING
    },
    PrimarySectionInchargeNumber: {
        type: DataTypes.STRING
    },
    SecondarySectionInchargeName: {
        type: DataTypes.STRING
    },
    SecondarySectionInchargeNumber: {
        type: DataTypes.STRING
    },
    Latitude: {
        type: DataTypes.DOUBLE
    },
    Longitude: {
        type: DataTypes.DOUBLE
    },
    SchoolLogo: {
        type: DataTypes.STRING
    },
    Username: {
        type: DataTypes.STRING
    },
    Password: {
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
    },

}, {
    tableName: 'school_master',
    timestamps: false
});

SchoolMasterModel.belongsTo(CountryMaster, { foreignKey: 'CountryID', targetKey: 'CountryID' });
SchoolMasterModel.belongsTo(CityMasterModel, { foreignKey: 'CityID', targetKey: 'CityID' });

module.exports = SchoolMasterModel;