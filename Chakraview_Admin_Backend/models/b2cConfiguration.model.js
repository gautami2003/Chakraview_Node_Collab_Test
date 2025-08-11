const sequelize_connection = require("../configs/db-connection.config");
const { DataTypes } = require("sequelize");
// const B2CPlanMasterConfigurationsModel = require('./b2cPlanMasterConfigurations.model');

const B2CConfiguration = sequelize_connection.define(
  "b2c_configuration",
  {
    B2CConfigurationID: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    BusOperatorID: {
      type: DataTypes.INTEGER,
    },
    PlanId: {
      type: DataTypes.INTEGER,
    },
    SubDurationInDays: {
      type: DataTypes.INTEGER,
    },
    SubName: {
      type: DataTypes.STRING,
    },
    SubDesc: {
      type: DataTypes.STRING,
    },
    SubDate: {
      type: DataTypes.DATE,
    },
    SubPrice: {
      type: DataTypes.INTEGER,
    },
    isDate: {
      type: DataTypes.STRING,
    },
    UpdatedBy: {
      type: DataTypes.STRING,
    },
    UpdatedOn: {
      type: DataTypes.DATE,
    },
    isB2CPayment: {
      type: DataTypes.STRING,
    }
  },
  {
    tableName: "b2c_configuration",
    timestamps: false,
  }
);
module.exports = B2CConfiguration;
