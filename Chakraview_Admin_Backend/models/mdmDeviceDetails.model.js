const sequelize_connection = require("../configs/db-connection.config");
const { DataTypes } = require("sequelize");

const MdmDeviceDetails = sequelize_connection.define(
  "b2c_configuration",
  {
    DeviceDetailID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    DeviceID: {
      type: DataTypes.INTEGER,
    },
    DateOfPurchased: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "b2c_configuration",
    timestamps: false,
  }
);

module.exports = MdmDeviceDetails;
