const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const BusOperatorAdsModel = sequelize_connection.define('bus_operator_adsimage', {
    AdsImgID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    BusOperatorID: {
        type: DataTypes.STRING
    },
    Business_Type: {
        type: DataTypes.STRING
    },
    AdsImgURL: {
        type: DataTypes.STRING
    },
    CTAType: {
        type: DataTypes.STRING
    },
    CreatedOn: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'bus_operator_adsimage',
    timestamps: false
});
module.exports = BusOperatorAdsModel;