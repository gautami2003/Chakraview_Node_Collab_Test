const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');

const UserRolesModel = sequelize_connection.define('user_roles', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'user_roles',
    timestamps: false
});

module.exports = UserRolesModel;
