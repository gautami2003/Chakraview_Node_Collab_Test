const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const FeesZonewiseErrorlogsModel = sequelize_connection.define('fees_zonewise_errorlogs', {
    FZ_Id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Error_Message: {
        type: DataTypes.JSON
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    StudentID: {
        type: DataTypes.INTEGER
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    SchoolName: {
        type: DataTypes.STRING
    },
    CreatedOn: {
        type: DataTypes.DATE
    },
}, {
    tableName: 'fees_zonewise_errorlogs',
    timestamps: false
});

module.exports = FeesZonewiseErrorlogsModel;