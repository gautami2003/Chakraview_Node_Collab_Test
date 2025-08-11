const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const SchoolMasterModel = require('./schoolMaster.model');
const BusInchargeMasterModel = require('./busInchargeMaster.model');

const DropRouteMasterModel = sequelize_connection.define('drop_route_master', {
    DropRouteID: {
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
    StartTime_Drop: {
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
    EndTime_Drop: {
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
    tableName: 'drop_route_master',
    timestamps: false
});
DropRouteMasterModel.belongsTo(SchoolMasterModel, { foreignKey: 'SchoolID' });
DropRouteMasterModel.belongsTo(BusInchargeMasterModel, { foreignKey: 'DriverID' });
SchoolMasterModel.hasMany(DropRouteMasterModel, { foreignKey: 'SchoolID' });
module.exports = DropRouteMasterModel;