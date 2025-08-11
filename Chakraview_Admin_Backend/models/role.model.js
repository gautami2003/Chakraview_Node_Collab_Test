const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const UserMaster = require('./userMaster.model');
const UserRoleModel = require('./userRole.model');
// const { DB_MODELS } = require("../constants/models.constant");

const RolesModel = sequelize_connection.define('roles', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'roles',
    timestamps: false
});

// RolesModel.belongsToMany(UserMaster, {
//     through: UserRoleModel,
//     foreignKey: 'role_id',
//     otherKey: 'user_id'
// });

module.exports = RolesModel;
