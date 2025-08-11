const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const StudentMasterModel = require('./studentMaster.model');

const AbsentLogModel = sequelize_connection.define('absent_log', {
    AbsentLogID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    StudentID: {
        type: DataTypes.INTEGER
    },
    Type: {
        type: DataTypes.STRING
    },
    Date: {
        type: DataTypes.DATE
    },
    DateTime: {
        type: DataTypes.DATE
    },
}, {
    tableName: 'absent_log',
    timestamps: false
});

AbsentLogModel.belongsTo(StudentMasterModel, { foreignKey: 'StudentID' });

module.exports = AbsentLogModel;