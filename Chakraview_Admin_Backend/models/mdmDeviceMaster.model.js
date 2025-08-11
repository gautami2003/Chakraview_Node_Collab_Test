const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const MdmDeviceMasterModel = sequelize_connection.define('mdm_device_master', {
    DeviceID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    DeviceSerialNumber: {
        type: DataTypes.STRING
    },
    IMEI1: {
        type: DataTypes.STRING
    },
    IMEI2: {
        type: DataTypes.STRING
    },
    FCMID: {
        type: DataTypes.STRING
    },
    DateOfPurchased: {
        type: DataTypes.DATE
    },
    PrimaryModel: {
        type: DataTypes.STRING
    },
    SecondaryModel: {
        type: DataTypes.STRING
    },
    AndroidVersion: {
        type: DataTypes.STRING
    },
    Vendor_1: {
        type: DataTypes.STRING
    },
    Vendor_2: {
        type: DataTypes.STRING
    },
    Price: {
        type: DataTypes.STRING
    },
    ModeOfPayment: {
        type: DataTypes.STRING
    },
    PaymentAccount: {
        type: DataTypes.STRING
    },
    Color: {
        type: DataTypes.STRING
    },
    Remarks_Repair: {
        type: DataTypes.STRING
    },
    Remarks_Lost: {
        type: DataTypes.STRING
    },
    Remarks_Battery_Change: {
        type: DataTypes.STRING
    },
    Remarks_Exchanged: {
        type: DataTypes.STRING
    },
    Remarks_Misc: {
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
    tableName: 'mdm_device_master',
    timestamps: false
});

module.exports = MdmDeviceMasterModel;