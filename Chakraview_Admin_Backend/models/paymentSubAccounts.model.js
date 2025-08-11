const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const PaymentSubAccountsModel = sequelize_connection.define('payment_sub_accounts', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    school_id: {
        type: DataTypes.INTEGER
    },
    sub_account_id: {
        type: DataTypes.STRING
    },
}, {
    tableName: 'payment_sub_accounts',
    timestamps: false
});

module.exports = PaymentSubAccountsModel;