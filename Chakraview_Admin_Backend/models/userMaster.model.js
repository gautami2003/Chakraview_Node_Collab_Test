const sequelize_connection = require("../configs/db-connection.config");
const { DataTypes } = require("sequelize");
const RoleModel = require("./role.model");
const UserRoleModel = require("./userRole.model");
// const RoleModel = require("./role.model");
// const { DB_MODELS } = require("../constants/models.constant");

const UserMaster = sequelize_connection.define(
  "user_master",
  {
    UserID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ParentUserID: {
      type: DataTypes.INTEGER,
    },
    UserName: {
      type: DataTypes.STRING,
    },
    Password: {
      type: DataTypes.STRING,
    },
    CreatedBy: {
      type: DataTypes.STRING,
    },
    CreatedOn: {
      type: DataTypes.DATE,
    },
    UpdatedBy: {
      type: DataTypes.STRING,
    },
    UpdatedOn: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "user_master",
    timestamps: false,
  }
);

// UserMaster.hasOne(BusOperatorMasterModel, { foreignKey: 'UserID' });
UserMaster.belongsToMany(RoleModel, {
  through: UserRoleModel,
  foreignKey: 'user_id',
  otherKey: 'role_id'
});

// RoleModel.belongsToMany(UserMaster, {
//   through: UserRoleModel,
//   foreignKey: 'role_id',
//   otherKey: 'user_id'
// });

module.exports = UserMaster;
