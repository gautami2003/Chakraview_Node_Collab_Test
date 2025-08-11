const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const MdmNetworkStatusModel = sequelize_connection.define('mdm_network_status', {
    NetworkStatusID: {
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
    CID: {
        type: DataTypes.STRING
    },
    DataActivity: {
        type: DataTypes.STRING
    },
    LAC: {
        type: DataTypes.STRING
    },
    NetworkOperatorName: {
        type: DataTypes.STRING
    },
    NetworkType: {
        type: DataTypes.STRING
    },
    
    OperatorName: {
        type: DataTypes.STRING
    },
    PhoneType: {
        type: DataTypes.STRING
    },
    SIMStatus: {
        type: DataTypes.STRING
    },
    isEnabled: {
        type: DataTypes.STRING
    },

}, {
    tableName: 'mdm_network_status',
    timestamps: false
});

module.exports = MdmNetworkStatusModel;

