const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const B2CConfiguration = require('./b2cConfiguration.model');

const B2CPlanMasterConfigurationsModel = sequelize_connection.define('b2c_plan_master_configurations', {
    PlanID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    MessageProviderURL1: {
        type: DataTypes.STRING
    },
    isSMS: {
        type: DataTypes.STRING
    },
    isNotification: {
        type: DataTypes.STRING
    },
    isTypeDistanceMessage: {
        type: DataTypes.STRING
    },
    isTypeDistanceMobileNofication: {
        type: DataTypes.STRING
    },
    isTypeDistanceMessagePrePrimary: {
        type: DataTypes.STRING
    },
    isTypeDistanceMessagePrimary: {
        type: DataTypes.STRING
    },
    isTypeDistanceMessageSecondary: {
        type: DataTypes.STRING
    },
    GPSIntervalForParent: {
        type: DataTypes.STRING
    },
    PlanDisplay: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'b2c_plan_master_configurations',
    timestamps: false
});
// Note: Relationship can be defined in any table, Parent or child. It just should be exists/defined in any of the models.
B2CPlanMasterConfigurationsModel.hasOne(B2CConfiguration, { foreignKey: 'PlanId' })
B2CConfiguration.belongsTo(B2CPlanMasterConfigurationsModel, { foreignKey: 'PlanId' });
module.exports = B2CPlanMasterConfigurationsModel;