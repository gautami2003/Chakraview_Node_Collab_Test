const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const MdmBrightnessModel = sequelize_connection.define('mdm_brightness', {
    BrightnessID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    IMEI: {
        type: DataTypes.STRING
    },
    DateTime: {
        type: DataTypes.DATE
    },
    BrightnessValue: {
        type: DataTypes.STRING
    },
   


}, {
    tableName: 'mdm_brightness',
    timestamps: false
});

module.exports = MdmBrightnessModel;

