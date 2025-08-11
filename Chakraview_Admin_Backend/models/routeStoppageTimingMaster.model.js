const sequelize_connection = require('../configs/db-connection.config');
const SchoolMasterModel = require('./schoolMaster.model');
const StoppageMasterModel = require('./stoppageMaster.model');
const { DataTypes } = require('sequelize');

const RouteStoppageTimingMasterModel = sequelize_connection.define('route_stoppage_timing_master', {
    RouteStoppageTimingID: {
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
    Type: {
        type: DataTypes.STRING
    },
    RouteID: {
        type: DataTypes.INTEGER
    },
    StoppageID: {
        type: DataTypes.INTEGER
    },
    StoppageTimeHour: {
        type: DataTypes.STRING
    },
    StoppageTimeMinute: {
        type: DataTypes.STRING
    },
    StoppageTimeAMPM: {
        type: DataTypes.INTEGER
    },
    StoppageTime: {
        type: DataTypes.INTEGER
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
    tableName: 'route_stoppage_timing_master',
    timestamps: false
});
RouteStoppageTimingMasterModel.belongsTo(StoppageMasterModel, { foreignKey: 'StoppageID' });
RouteStoppageTimingMasterModel.belongsTo(SchoolMasterModel, { foreignKey: 'SchoolID' });

module.exports = RouteStoppageTimingMasterModel;