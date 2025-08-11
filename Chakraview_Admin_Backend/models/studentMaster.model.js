const sequelize_connection = require('../configs/db-connection.config');
const { DataTypes } = require('sequelize');
const StoppageMasterModel = require('./stoppageMaster.model');
const SchoolMasterModel = require('./schoolMaster.model');
const BusOperatorMasterModel = require('./busOperatorMaster.model');
const PickupRouteMaster = require('./pickupRouteMaster.model');
const DropRouteMasterModel = require('./dropRouteMaster.model');
const CityMasterModel = require('./cityMaster.model');
const CountryMaster = require('./countryMaster.model');

const StudentMasterModel = sequelize_connection.define('student_master', {
    StudentID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    BusOperatorID: {
        type: DataTypes.INTEGER
    },
    BusName: {
        type: DataTypes.STRING
    },
    FatherName: {
        type: DataTypes.STRING
    },
    MotherName: {
        type: DataTypes.STRING
    },
    SchoolID: {
        type: DataTypes.INTEGER
    },
    SchoolSection: {
        type: DataTypes.STRING
    },
    StudentName: {
        type: DataTypes.STRING
    },
    StudentNameHindi: {
        type: DataTypes.STRING
    },
    StudentStandard: {
        type: DataTypes.STRING
    },
    StudentClass: {
        type: DataTypes.STRING
    },
    StudentBldGrp: {
        type: DataTypes.STRING
    },
    CountryID: {
        type: DataTypes.INTEGER
    },
    Address1: {
        type: DataTypes.STRING
    },
    Address2: {
        type: DataTypes.STRING
    },
    AddressZone: {
        type: DataTypes.STRING
    },
    CityID: {
        type: DataTypes.INTEGER
    },
    Pincode: {
        type: DataTypes.STRING
    },
    FatherMobileNumber: {
        type: DataTypes.STRING
    },
    MotherMobileNumber: {
        type: DataTypes.STRING
    },
    OtherMobileNumber: {
        type: DataTypes.STRING
    },
    PrimaryMobileNumber: {
        type: DataTypes.STRING
    },
    PrimaryMobileNumberOf: {
        type: DataTypes.STRING
    },
    EmailID: {
        type: DataTypes.STRING
    },
    PlanID: {
        type: DataTypes.STRING
    },
    isBan: {
        type: DataTypes.STRING
    },
    isGPS: {
        type: DataTypes.STRING
    },
    IMEINumber: {
        type: DataTypes.STRING
    },
    FromRouteID: {
        type: DataTypes.INTEGER
    },
    ToRouteID: {
        type: DataTypes.INTEGER
    },
    FromStoppageID: {
        type: DataTypes.INTEGER
    },
    ToStoppageID: {
        type: DataTypes.INTEGER
    },
    PickupMonday: {
        type: DataTypes.STRING
    },
    PickupTuesday: {
        type: DataTypes.STRING
    },
    PickupWednesday: {
        type: DataTypes.STRING
    },
    PickupThursday: {
        type: DataTypes.STRING
    },
    PickupFriday: {
        type: DataTypes.STRING
    },
    PickupSaturday: {
        type: DataTypes.STRING
    },
    PickupSunday: {
        type: DataTypes.STRING
    },
    DropMonday: {
        type: DataTypes.STRING
    },
    DropTuesday: {
        type: DataTypes.STRING
    },
    DropWednesday: {
        type: DataTypes.STRING
    },
    DropThursday: {
        type: DataTypes.STRING
    },
    DropFriday: {
        type: DataTypes.STRING
    },
    DropSaturday: {
        type: DataTypes.STRING
    },
    DropSunday: {
        type: DataTypes.STRING
    },
    StayBackToRouteID: {
        type: DataTypes.INTEGER
    },
    StayBackDropMonday: {
        type: DataTypes.STRING
    },
    StayBackDropTuesday: {
        type: DataTypes.STRING
    },
    StayBackDropWednesday: {
        type: DataTypes.STRING
    },
    StayBackDropThursday: {
        type: DataTypes.STRING
    },
    StayBackDropFriday: {
        type: DataTypes.STRING
    },
    StayBackDropSaturday: {
        type: DataTypes.STRING
    },
    StayBackDropSunday: {
        type: DataTypes.STRING
    },
    ChakraviewCode: {
        type: DataTypes.STRING
    },
    SchoolCode: {
        type: DataTypes.STRING
    },
    Student_Img: {
        type: DataTypes.STRING
    },
    isAttendance: {
        type: DataTypes.STRING
    },
    CreatedBy: {
        type: DataTypes.STRING
    },
    isDeleted: {
        type: DataTypes.STRING
    },
    Year: {
        type: DataTypes.STRING
    },
    CreatedOn: {
        type: DataTypes.DATE
    },
    UpdatedBy: {
        type: DataTypes.STRING
    },
    UpdatedOn: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'student_master',
    timestamps: false
});
// Removed below code porposely -- we cannot have two relationship, otherwise it will always take last one defined.


StudentMasterModel.belongsTo(StoppageMasterModel, { foreignKey: 'ToStoppageID', targetKey: 'StoppageID', as: 'ToStoppage' });
StudentMasterModel.belongsTo(StoppageMasterModel, { foreignKey: 'FromStoppageID', targetKey: 'StoppageID' });

StudentMasterModel.belongsTo(SchoolMasterModel, { foreignKey: 'SchoolID' });
StudentMasterModel.belongsTo(BusOperatorMasterModel, { foreignKey: 'BusOperatorID' });
StudentMasterModel.belongsTo(PickupRouteMaster, { foreignKey: 'FromRouteID' });

StudentMasterModel.belongsTo(DropRouteMasterModel, { foreignKey: 'StayBackToRouteID', as: 'StayBackRoute' });
StudentMasterModel.belongsTo(DropRouteMasterModel, { foreignKey: 'ToRouteID' });

StudentMasterModel.belongsTo(CityMasterModel, { foreignKey: 'CityID' });
StudentMasterModel.belongsTo(CountryMaster, { foreignKey: 'CountryID' });

module.exports = StudentMasterModel;