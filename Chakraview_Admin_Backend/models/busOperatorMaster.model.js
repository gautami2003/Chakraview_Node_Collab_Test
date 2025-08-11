const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const B2CConfiguration = require('./b2cConfiguration.model');
const ConfigurationSmsLongCodeCallModel = require('./configurationSmsLongcodeCall.model');
const BusOperatorAdsModel = require('./busOperatorAdsimage.model');
const UserMaster = require('./userMaster.model');
const CityMasterModel = require('./cityMaster.model');

const BusOperatorMasterModel = sequelize_connection.define('bus_operator_master', {
    BusOperatorID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    BusOperatorName: {
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
    PhoneNumber: {
        type: DataTypes.STRING
    },
    EmailID: {
        type: DataTypes.STRING
    },
    WebsiteURL: {
        type: DataTypes.STRING
    },
    OwnerName: {
        type: DataTypes.STRING
    },
    OwnerPhoneNumber: {
        type: DataTypes.STRING
    },
    UserID: {
        type: DataTypes.INTEGER
    },
    LogoImage: {
        type: DataTypes.STRING
    },
    isActive: {
        type: DataTypes.STRING
    },
    TC: {
        type: DataTypes.STRING
    },
    isPhone: {
        type: DataTypes.STRING
    },
    isFees: {
        type: DataTypes.STRING
    },
    OfflineLatlongSMSFrequency: {
        type: DataTypes.STRING
    },
    Longcode: {
        type: DataTypes.STRING
    },
    BusinessType: {
        type: DataTypes.STRING
    },
    TimeZone: {
        type: DataTypes.STRING
    },
    isDeleted: {
        type: DataTypes.STRING
    },
    BusOperatorLogo: {
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
    tableName: 'bus_operator_master',
    timestamps: false
});
// BusOperatorMasterModel.belongsTo(DB_MODELS.CITY_MASTER, { foreignKey: 'CityID' });
BusOperatorMasterModel.hasOne(B2CConfiguration, { foreignKey: 'BusOperatorID' });
BusOperatorMasterModel.hasOne(ConfigurationSmsLongCodeCallModel, { foreignKey: 'BusOperatorID' });
BusOperatorMasterModel.hasOne(BusOperatorAdsModel, { foreignKey: 'BusOperatorID' });

BusOperatorMasterModel.belongsTo(UserMaster, { foreignKey: 'UserID' });
// BusOperatorMasterModel.belongsTo(CityMasterModel, { foreignKey: 'CityID' });
module.exports = BusOperatorMasterModel;