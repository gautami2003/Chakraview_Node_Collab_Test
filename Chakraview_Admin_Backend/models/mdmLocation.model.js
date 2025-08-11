const sequelize_connection = require("../configs/db-connection.config");
const { DataTypes } = require("sequelize");

const MdmLocation = sequelize_connection.define(
  "mdm_location",
  {
    MDMLocationID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    IMEI: {
      type: DataTypes.STRING,
    },
    DateTime: {
      type: DataTypes.DATE,
    },
    Latitude: {
      type: DataTypes.DOUBLE,
    },
    Longitude: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    tableName: "mdm_location",
    timestamps: false,
  }
);

module.exports = MdmLocation;
