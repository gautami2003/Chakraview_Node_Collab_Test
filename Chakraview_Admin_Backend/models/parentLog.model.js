const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const SchoolMasterModel = require('./schoolMaster.model');
const StudentMasterModel = require('./studentMaster.model');
const PickupRouteModel = require('./pickupRouteMaster.model');
const DropRouteMasterModel = require('./dropRouteMaster.model');


const ParentLogModel = sequelize_connection.define('parent_log', {
    ParentLogID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    StudentID: {
        type: DataTypes.STRING
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    Type: {
        type: DataTypes.STRING
    },
    RouteID: {
        type: DataTypes.STRING
    },
    MobileNumber: {
        type: DataTypes.STRING
    },
    OS: {
        type: DataTypes.STRING
    },
    MapDateTime: {
        type: DataTypes.DATE
    },
    LoginDateTime: {
        type: DataTypes.DATE
    },
    LogoutDateTime: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'parent_log',
    timestamps: false
});

// Association to SchoolMasterModel
ParentLogModel.belongsTo(SchoolMasterModel, {
  foreignKey: 'SchoolID',  // column in parent_log table linking to school_master
  as: 'school_master',     // alias used in include queries
});
ParentLogModel.belongsTo(StudentMasterModel, {
  foreignKey: 'StudentID',  // column in parent_log table linking to school_master
  as: 'student_master',     // alias used in include queries
});
// Association to PickupRouteMasterModel
ParentLogModel.belongsTo(PickupRouteModel, {
  foreignKey: 'RouteID',
  targetKey: 'PickupRouteID',
  as: 'pickup_route',
});

// Association to DropRouteMasterModel
ParentLogModel.belongsTo(DropRouteMasterModel, {
  foreignKey: 'RouteID',
  targetKey: 'DropRouteID',
  as: 'drop_route',
});


module.exports = ParentLogModel;
