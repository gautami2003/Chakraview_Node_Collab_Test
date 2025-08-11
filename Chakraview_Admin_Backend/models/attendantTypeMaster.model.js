const sequelize_connection = require("../configs/db-connection.config");
const { DataTypes } = require("sequelize");

const AttendantTypeMaster = sequelize_connection.define(
  "attendant_type_master",
  {
    AttendantTypeID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    AttendantTypeName: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "attendant_type_master",
    timestamps: false,
  }
);

module.exports = AttendantTypeMaster;
