const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const SchoolMasterModel = require('./schoolMaster.model');
const StudentMasterModel = require('./studentMaster.model');
const PickupRouteModel = require('./pickupRouteMaster.model');
const DropRouteMasterModel = require('./dropRouteMaster.model');
const StoppageMasterModel = require('./stoppageMaster.model');
const DriverRouteTransactionModel = require('./driverRouteTransaction.model');
const BusInchargeMasterModel = require('./busInchargeMaster.model');


const DistanceMessageLogModel = sequelize_connection.define('distance_message_log', {
    DistanceMessageLogID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    DriverRouteTransactionID: {
        type: DataTypes.INTEGER
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    RouteID: {
        type: DataTypes.INTEGER
    },
    MobileNumber: {
        type: DataTypes.INTEGER
    },
    Type: {
        type: DataTypes.STRING
    },
    StoppageID: {
        type: DataTypes.INTEGER
    },
    MessageURL: {
        type: DataTypes.STRING
    },
    MessageCount: {
        type: DataTypes.INTEGER
    },
    Latitude: {
        type: DataTypes.DOUBLE
    },
    Longitude: {
        type: DataTypes.DOUBLE
    },
    Distance: {
        type: DataTypes.DOUBLE
    },
    DateTime: {
        type: DataTypes.DATE
    },



}, {
    tableName: 'distance_message_log',
    timestamps: false
});
// Association to SchoolMasterModel
DistanceMessageLogModel.belongsTo(SchoolMasterModel, {
  foreignKey: 'SchoolID',  // column in parent_log table linking to school_master
  as: 'school_master',     // alias used in include queries
});

// Association to PickupRouteMasterModel
DistanceMessageLogModel.belongsTo(PickupRouteModel, {
  foreignKey: 'RouteID',
  targetKey: 'PickupRouteID',
  as: 'pickup_route',
});

// Association to DropRouteMasterModel
DistanceMessageLogModel.belongsTo(DropRouteMasterModel, {
  foreignKey: 'RouteID',
  targetKey: 'DropRouteID',
  as: 'drop_route',
});

DistanceMessageLogModel.belongsTo(StoppageMasterModel, {
  foreignKey: 'StoppageID',
  as: 'stoppage_master',
});

DistanceMessageLogModel.belongsTo(DriverRouteTransactionModel, {
  foreignKey: 'DriverRouteTransactionID',
  targetKey: 'DriverRouteTransactionID',
  as: 'driver_route_transaction'
});

// DriverRouteTransaction belongs to BusInchargeMaster
DriverRouteTransactionModel.belongsTo(BusInchargeMasterModel, {
  foreignKey: 'DriverID',
  targetKey: 'DriverID',
  as: 'bus_incharge_master'
});
module.exports = DistanceMessageLogModel;