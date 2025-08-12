const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const SchoolMasterModel = require('./schoolMaster.model');
const PortalMessageLogModel = sequelize_connection.define('portal_message_log', {
    PortalMessageLogID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    page: {
        type: DataTypes.STRING
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    PickupRouteID: {
        type: DataTypes.INTEGER
    },
    DropRouteID: {
        type: DataTypes.INTEGER
    },
    MobileNumbers: {
        type: DataTypes.INTEGER
    },
    StudentStandard: {
        type: DataTypes.STRING
    },
    Message: {
        type: DataTypes.STRING
    },
    DateTime: {
        type: DataTypes.DATE
    },
}, {
    tableName: 'portal_message_log',
    timestamps: false
});
// Association to SchoolMasterModel
PortalMessageLogModel.belongsTo(SchoolMasterModel, {
  foreignKey: 'SchoolID',
  as: 'school_master', 
});
module.exports = PortalMessageLogModel;