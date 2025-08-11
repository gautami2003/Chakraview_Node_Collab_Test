const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const SchoolMasterModel = require('./schoolMaster.model');
const BusInchargeMasterModel = require('./busInchargeMaster.model');

const PickupRouteMasterModel = sequelize_connection.define('pickup_route_master', {
    PickupRouteID: {
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
    RouteName: {
        type: DataTypes.STRING
    },
    BusName: {
        type: DataTypes.STRING
    },
    DriverID: {
        type: DataTypes.INTEGER
    },
    StartLocation: {
        type: DataTypes.STRING
    },
    DestinationLocation: {
        type: DataTypes.STRING
    },
    StartTimeHour: {
        type: DataTypes.STRING
    },
    StartTimeMinute: {
        type: DataTypes.STRING
    },
    StartTimeAMPM: {
        type: DataTypes.STRING
    },
    StartTime_PickUp: {
        type: DataTypes.STRING
    },
    EndTimeHour: {
        type: DataTypes.STRING
    },
    EndTimeMinute: {
        type: DataTypes.STRING
    },
    EndTimeAMPM: {
        type: DataTypes.STRING
    },
    EndTime_PickUp: {
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
    IdealKMS: {
        type: DataTypes.DOUBLE
    }
}, {
    tableName: 'pickup_route_master',
    timestamps: false
});

PickupRouteMasterModel.belongsTo(SchoolMasterModel, { foreignKey: 'SchoolID' });
PickupRouteMasterModel.belongsTo(BusInchargeMasterModel, { foreignKey: 'DriverID' });
SchoolMasterModel.hasMany(PickupRouteMasterModel, { foreignKey: 'SchoolID' });

module.exports = PickupRouteMasterModel;