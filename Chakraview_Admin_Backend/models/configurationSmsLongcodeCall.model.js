const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const BusOperatorMasterModel = require('./busOperatorMaster.model');
const B2CConfiguration = require('./b2cConfiguration.model');

const ConfigurationSmsLongCodeCallModel = sequelize_connection.define('configuration_sms_longcode_call', {
    ConfigurationID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    isPhone: {
        type: DataTypes.STRING
    },
    isWhatsApp: {
        type: DataTypes.STRING
    },
    isETA: {
        type: DataTypes.STRING
    },
    isNotification2All: {
        type: DataTypes.STRING
    },
    AllowSignup: {
        type: DataTypes.STRING
    },
    AllowParentsToCall: {
        type: DataTypes.STRING
    },
    AllowParentsToWhatsAppCall: {
        type: DataTypes.STRING
    },
    AllowParentsToSendSMS: {
        type: DataTypes.STRING
    },
    AllowAttendanceFromCheckbox: {
        type: DataTypes.STRING
    },
    AllowAttendanceFromNFC: {
        type: DataTypes.STRING
    },
    AllowVideoRecording: {
        type: DataTypes.STRING
    },
    isStoppageUpdatable: {
        type: DataTypes.STRING
    },
    isLongcode: {
        type: DataTypes.STRING
    },
    Longcode: {
        type: DataTypes.STRING
    },
    isGoogleAds: {
        type: DataTypes.STRING
    },
    GoogleAdsAPIKey: {
        type: DataTypes.STRING
    },
    OfflineLatlongSMSFrequency: {
        type: DataTypes.STRING
    },
    isSMS: {
        type: DataTypes.STRING
    },
    isNotification: {
        type: DataTypes.STRING
    },
    MessageProviderURL1: {
        type: DataTypes.STRING
    },
    MessageProviderURL2: {
        type: DataTypes.STRING
    },
    isTypeDistanceMessage: {
        type: DataTypes.STRING
    },
    isTypeDistanceMobileNofication: {
        type: DataTypes.STRING
    },
    isTypeDistanceMessagePrePrimary: {
        type: DataTypes.STRING
    },
    isTypeDistanceMessagePrimary: {
        type: DataTypes.STRING
    },
    isTypeDistanceMessageSecondary: {
        type: DataTypes.STRING
    },
    isTypeSMS2: {
        type: DataTypes.STRING
    },
    isTypeSMS2MobileNofication: {
        type: DataTypes.STRING
    },
    isTypeSMS3: {
        type: DataTypes.STRING
    },
    isTypeSMS3MobileNofication: {
        type: DataTypes.STRING
    },
    isTypeIndividualSMS: {
        type: DataTypes.STRING
    },
    isTypeIndividualMobileNofication: {
        type: DataTypes.STRING
    },
    isTypeGroupSMS: {
        type: DataTypes.STRING
    },
    isTypeGroupMobileNofication: {
        type: DataTypes.STRING
    },
    isTypePortalSMS: {
        type: DataTypes.STRING
    },
    isTypePortalMobileNofication: {
        type: DataTypes.STRING
    },
    isLateStartSMSToBusOperator: {
        type: DataTypes.STRING
    },
    isLateStartMobileNotificationToBusOperator: {
        type: DataTypes.STRING
    },
    isPickup1SMS: {
        type: DataTypes.STRING
    },
    isPickup1MobileNofication: {
        type: DataTypes.STRING
    },
    isPickup2SMS: {
        type: DataTypes.STRING
    },
    isPickup2MobileNofication: {
        type: DataTypes.STRING
    },
    isDrop1SMS: {
        type: DataTypes.STRING
    },
    isDrop1MobileNofication: {
        type: DataTypes.STRING
    },
    isDrop2SMS: {
        type: DataTypes.STRING
    },
    isDrop2MobileNofication: {
        type: DataTypes.STRING
    },
    isAutoActive: {
        type: DataTypes.STRING
    },
    SMSServiceDisableMessage: {
        type: DataTypes.STRING
    },
    IndividualSMS1: {
        type: DataTypes.STRING
    },
    IndividualSMS2: {
        type: DataTypes.STRING
    },
    IndividualSMS3: {
        type: DataTypes.STRING
    },
    IndividualSMS4: {
        type: DataTypes.STRING
    },
    IndividualSMS5: {
        type: DataTypes.STRING
    },
    GroupSMS1: {
        type: DataTypes.STRING
    },
    GroupSMS2: {
        type: DataTypes.STRING
    },
    GPSInterval: {
        type: DataTypes.STRING
    },
    DistanceInterval: {
        type: DataTypes.STRING
    },
    ExitPasswordForLauncher: {
        type: DataTypes.STRING
    },
    GPSIntervalForParent: {
        type: DataTypes.STRING
    },
    streaming_attendant_app: {
        type: DataTypes.INTEGER
    },
    streaming_iot_device: {
        type: DataTypes.INTEGER
    },
    primary_streaming_method: {
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
    tableName: 'configuration_sms_longcode_call',
    timestamps: false
});

ConfigurationSmsLongCodeCallModel.belongsTo(B2CConfiguration, { foreignKey: 'BusOperatorID', targetKey: 'BusOperatorID' });

module.exports = ConfigurationSmsLongCodeCallModel;