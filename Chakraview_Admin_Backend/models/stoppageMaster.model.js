const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const SchoolMasterModel = require('./schoolMaster.model');
const BusOperatorMasterModel = require('./busOperatorMaster.model');
const CountryMaster = require('./countryMaster.model');
const CityMasterModel = require('./cityMaster.model');

const StoppageMasterModel = sequelize_connection.define('stoppage_master', {
    StoppageID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    StopageName: {
        type: DataTypes.STRING
    },
    Location: {
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
    GoogleMapURL: {
        type: DataTypes.STRING
    },
    Latitude: {
        type: DataTypes.TEXT('tiny')
    },
    Longitude: {
        type: DataTypes.TEXT('tiny')
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
    tableName: 'stoppage_master',
    timestamps: false
});

StoppageMasterModel.belongsTo(SchoolMasterModel, {
    foreignKey: 'SchoolID'
});
StoppageMasterModel.belongsTo(BusOperatorMasterModel, {
    foreignKey: 'BusOperatorID'
});
StoppageMasterModel.belongsTo(CountryMaster, { foreignKey: 'CountryID' });
StoppageMasterModel.belongsTo(CityMasterModel, { foreignKey: 'CityID' });
module.exports = StoppageMasterModel;