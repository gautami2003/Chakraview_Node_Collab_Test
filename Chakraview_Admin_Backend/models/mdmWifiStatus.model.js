const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const MdmWifiStatusModel = sequelize_connection.define('mdm_WIFI_status', {
    WIFIStatusID: {
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
    WIFINetworkName: {
        type: DataTypes.STRING
    },
    MACAddress: {
        type: DataTypes.STRING
    },
    RSSI: {
        type: DataTypes.STRING
    },
    isP2PSupported: {
        type: DataTypes.STRING
    },
    isWIFIEnabled: {
        type: DataTypes.STRING
    },
    
   
}, {
    tableName: 'mdm_WIFI_status',
    timestamps: false
});

module.exports = MdmWifiStatusModel;

