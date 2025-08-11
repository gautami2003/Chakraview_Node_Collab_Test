const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const BusOperatorMasterModel = require('./busOperatorMaster.model');
const AttendantTypeMaster = require('./attendantTypeMaster.model');

const BusInchargeMasterModel = sequelize_connection.define('bus_incharge_master', {
    DriverID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    DriverName: {
        type: DataTypes.STRING
    },
    MobileNumber: {
        type: DataTypes.STRING
    },
    SecondaryMobileNumber: {
        type: DataTypes.STRING
    },
    AttendantTypeID: {
        type: DataTypes.INTEGER
    },
    DrivingLicenseNumber: {
        type: DataTypes.STRING
    },
    DrivingLicenseImage: {
        type: DataTypes.STRING
    },
    isBan: {
        type: DataTypes.STRING
    },
    IMEINumber: {
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
    tableName: 'bus_incharge_master',
    timestamps: false
});

BusInchargeMasterModel.belongsTo(BusOperatorMasterModel, { foreignKey: 'BusOperatorID' });
BusInchargeMasterModel.belongsTo(AttendantTypeMaster, { foreignKey: 'AttendantTypeID' });

module.exports = BusInchargeMasterModel;