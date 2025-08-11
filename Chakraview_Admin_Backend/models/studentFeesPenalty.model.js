const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const SchoolMasterModel = require('./schoolMaster.model');

const StudentFeesPenaltyModel = sequelize_connection.define('student_fees_penalty', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    school_id: {
        type: DataTypes.INTEGER
    },
    penalty_amount: {
        type: DataTypes.INTEGER
    },
    message: {
        type: DataTypes.STRING
    },
}, {
    tableName: 'student_fees_penalty',
    timestamps: false
});

StudentFeesPenaltyModel.belongsTo(SchoolMasterModel, { foreignKey: 'school_id' });


module.exports = StudentFeesPenaltyModel;