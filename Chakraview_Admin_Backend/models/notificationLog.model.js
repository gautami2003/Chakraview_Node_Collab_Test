const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const StudentMasterModel = require('./studentMaster.model');
const SchoolMasterModel = require('./schoolMaster.model');
const PickupRouteModel = require('./pickupRouteMaster.model');
const DropRouteMasterModel = require('./dropRouteMaster.model');
const DriverRouteTransactionModel = require('./driverRouteTransaction.model');
const BusInchargeMasterModel = require('./busInchargeMaster.model');

const NotificationLogModel = sequelize_connection.define('notification_log', {
    NotificationLogID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    DriverRouteTransactionID: {
        type: DataTypes.INTEGER
    },
    BusID: {
        type: DataTypes.INTEGER
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    RouteID: {
        type: DataTypes.INTEGER
    },
    StudentID: {
        type: DataTypes.INTEGER
    },
    Type: {
        type: DataTypes.STRING
    },
    MobileNumbers: {
        type: DataTypes.STRING
    },
    MessageURL: {
        type: DataTypes.STRING
    },
    MessageType: {
        type: DataTypes.STRING
    },
    DateTime: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'notification_log',
    timestamps: false
});

// Associations
NotificationLogModel.belongsTo(SchoolMasterModel, {
  foreignKey: 'SchoolID',
  as: 'school_master',
});

NotificationLogModel.belongsTo(StudentMasterModel, {
  foreignKey: 'StudentID',
  as: 'student_master',
});

NotificationLogModel.belongsTo(PickupRouteModel, {
  foreignKey: 'RouteID',
  targetKey: 'PickupRouteID',
  as: 'pickup_route',
});

NotificationLogModel.belongsTo(DropRouteMasterModel, {
  foreignKey: 'RouteID',
  targetKey: 'DropRouteID',
  as: 'drop_route',
});

NotificationLogModel.belongsTo(DriverRouteTransactionModel, {
  foreignKey: 'DriverRouteTransactionID',
  targetKey: 'DriverRouteTransactionID',
  as: 'driver_route_transaction'
});

NotificationLogModel.belongsTo(BusInchargeMasterModel, {
  foreignKey: 'DriverID',
  targetKey: 'DriverID',
  as: 'bus_incharge_master'
});

module.exports = NotificationLogModel;
