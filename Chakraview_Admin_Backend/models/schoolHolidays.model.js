const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const SchoolMasterModel = require('./schoolMaster.model');

const SchoolHolidaysModel = sequelize_connection.define('school_holidays', {
    SchoolHolidaysID: {
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
    StartDate: {
        type: DataTypes.DATE
    },
    EndDate: {
        type: DataTypes.DATE
    },
    Event: {
        type: DataTypes.STRING
    },
    Type: {
        type: DataTypes.STRING
    },
    isDeleted: {
        type: DataTypes.STRING
    },
    Standard: {
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
    tableName: 'school_holidays',
    timestamps: false
});

SchoolHolidaysModel.belongsTo(SchoolMasterModel, { foreignKey: 'SchoolID', targetKey: 'SchoolID' });

module.exports = SchoolHolidaysModel;