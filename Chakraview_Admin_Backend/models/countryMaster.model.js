const sequelize_connection = require("../configs/db-connection.config");
const { DataTypes } = require("sequelize");

const CountryMaster = sequelize_connection.define(
  "country_master",
  {
    CountryID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    CountryName: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "country_master",
    timestamps: false,
  }
);

module.exports = CountryMaster;
