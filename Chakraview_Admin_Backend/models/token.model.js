const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const TokenModel = sequelize_connection.define('tokens', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.STRING
    },
    created_at: {
        type: DataTypes.DATE
    },
}, {
    tableName: 'tokens',
    timestamps: false
});

module.exports = TokenModel;