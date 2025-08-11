const AbsentLogModel = require('../models/absentLog.model');
const ApiErrorLogsModel = require('../models/apiErrorLogs.model');

const BusMasterModel = require('../models/busMaster.model');
const BusInchargeMasterModel = require('../models/busInchargeMaster.model');
const BusOperatorMasterModel = require('../models/busOperatorMaster.model');
const B2CPlanMasterConfigurationsModel = require('../models/b2cPlanMasterConfigurations.model');

const CityMasterModel = require('../models/cityMaster.model');
const ConfigurationSmsLongCodeCallModel = require('../models/configurationSmsLongcodeCall.model');
const ConfigureDistanceSmsModel = require('../models/configureDistanceSms.model');

const DeviceMasterModel = require('../models/devicePassword.model');
const DistanceMessageLogModel = require('../models/distanceMessageLog.model');
const DriverRouteTransactionReferenceModel = require('../models/driverRouteTransactionReference.model');
const DriverRouteTransactionModel = require('../models/driverRouteTransaction.model');
const DropRouteMasterModel = require('../models/dropRouteMaster.model');
const LogTrackModel = require('../models/logTrack.model');

const MdmDeviceMasterModel = require('../models/mdmDeviceMaster.model');
const MessageLogModel = require('../models/messageLog.model');
const MdmBatteryStatusModel = require('../models/mdmBatteryStatus.model');
const MdmNetworkStatusModel = require('../models/mdmNetworkStatus.model');
const MdmBuildInfoModel = require('../models/mdmBuildInfo.model');
const MdmDeviceConfigModel = require('../models/mdmDeviceConfig.model');
const MdmWifiStatusModel = require('../models/mdmWifiStatus.model');
const MdmBluetoothStatusModel = require('../models/mdmBluetoothStatus.model');
const MdmBrightnessModel = require('../models/mdmBrightness.model');
const MobileSessionsModel = require('../models/mobileSessions.model');

const NotificationMessageLogModel = require('../models/notificationMessageLog.model');

const PickupRouteMasterModel = require('../models/pickupRouteMaster.model');
const ParentAppMobileSmsLogModel = require('../models/parentAppMobileSmsLog.model');

const RouteStoppageTimingMasterModel = require('../models/routeStoppageTimingMaster.model');

const SchoolMasterModel = require('../models/schoolMaster.model');
const StoppageMasterModel = require('../models/stoppageMaster.model');
const StudentMasterModel = require('../models/studentMaster.model');
const StudentAttendanceModel = require('../models/studentAttendance.model');
const StudentAttendanceMessageLogModel = require('../models/studentAttendanceMessageLog.model');
const StudentAttendanceCheckboxModel = require('../models/studentAttendanceCheckbox.model');
const SettingsModel = require('../models/settings.model');
const TokenModel = require('../models/token.model');
const ParentLogModel = require('../models/parentLog.model');
const CountryMasterModel = require('../models/countryMaster.model');
const B2C_CONFIGURATION = require("../models/b2cConfiguration.model");
const StudentAttendanceNotificationLogModel = require("../models/studentAttendanceNotificationLog.model");
const NotificationLogModel = require("../models/notificationLog.model");
const PortalMessageLogModel = require("../models/portalMessageLog.model");
const BusOperatorAdsModel = require("../models/busOperatorAdsimage.model");
const StudentSubscriptionMaster = require('../models/studentSubscriptionMaster.model');
const WebhookLogsModel = require('../models/webhookLogs.model');
const PaymentSubscriptionHistory = require('../models/paymentSubscriptionHistory.model');
const FeesMasterModel = require('../models/feesMaster.model');
const FeesCollectionModel = require('../models/feesCollection.model');
const PaymentLogsModel = require('../models/paymentLogs.model');
const UserMaster = require('../models/userMaster.model');
const MdmSimcardDetailsModel = require('../models/mdmSimcardDetails.model');
const AllocationModel = require('../models/Allocation.model');
const AllocationHistoryModel = require('../models/allocationHistory.model');
const AttendantTypeMaster = require('../models/attendantTypeMaster.model');
const RolesModel = require('../models/role.model');
const UserRolesModel = require('../models/userRole.model');
const SchoolHolidaysModel = require('../models/schoolHolidays.model');
const FeesMasterZonewisModel = require('../models/feesMasterZonewise.model');
const FeesCollectionZonewiseModel = require('../models/feesCollectionZonewise.model');
const PaymentSubAccountsModel = require('../models/paymentSubAccounts.model');
const FeesZonewiseErrorlogsModel = require('../models/feesZonewisEerrorlogs.model');
const StudentFeesPenaltyModel = require('../models/studentFeesPenalty.model');
const SchoolFeesDiscountModel = require('../models/schoolFeesDiscount.model');

const DB_MODELS = {
  "AbsentLogModel": AbsentLogModel,
  "Api_Error_Logs": ApiErrorLogsModel,
  "ALLOCATION": AllocationModel,
  "ALLOCATION_HISTORY": AllocationHistoryModel,
  "ATTENDANT_TYPE_MASTER": AttendantTypeMaster,

  "BUS_MASTER": BusMasterModel,
  "BUS_INCHARGE_MASTER": BusInchargeMasterModel,
  "BUS_OPERATOR_MASTER": BusOperatorMasterModel,
  "B2C_Plan_Master_Configurations": B2CPlanMasterConfigurationsModel,

  "CITY_MASTER": CityMasterModel,
  "CONFIGURATION_SMS_LONGCODE_CALL": ConfigurationSmsLongCodeCallModel,
  "CONFIGURE_DISTANCE_SMS": ConfigureDistanceSmsModel,

  "DRIVER_ROUTE_TRANSACTION": DriverRouteTransactionModel,
  "DISTANCE_MESSAGE_LOG": DistanceMessageLogModel,
  "DROP_ROUTE_MASTER": DropRouteMasterModel,
  "DRIVER_ROUTE_TRANSACTION_REFERENCE": DriverRouteTransactionReferenceModel,
  "DEVICE_MASTER": DeviceMasterModel,

  "LOG_TRACK": LogTrackModel,

  "MDM_DEVICE_MASTER": MdmDeviceMasterModel,
  "MESSAGE_LOG": MessageLogModel,
  "MDM_BATTERY_STATUS": MdmBatteryStatusModel,
  "MDM_NETWORK_STATUS": MdmNetworkStatusModel,
  "MDM_BUILD_INFO": MdmBuildInfoModel,
  "MDM_DEVICE_CONFIG": MdmDeviceConfigModel,
  "MDM_WIFI_STATUS": MdmWifiStatusModel,
  "MDM_BLUETOOTH_STATUS": MdmBluetoothStatusModel,
  "MDM_BRIGHTNESS": MdmBrightnessModel,
  "MOBILE_SESSIONS": MobileSessionsModel,

  "NOTIFICATION_MESSAGE_LOG": NotificationMessageLogModel,

  "PICKUP_ROUTE_MASTER": PickupRouteMasterModel,
  "PARENT_APP_MOBILE_SMS_LOG": ParentAppMobileSmsLogModel,
  "PAYMENT_SUBSCRIPTION_HISTORY": PaymentSubscriptionHistory,

  "ROUTE_STOPPAGE_TIMING_MASTER": RouteStoppageTimingMasterModel,
  "SETTINGS": SettingsModel,
  "SCHOOL_MASTER": SchoolMasterModel,
  "SCHOOL_HOLIDAYS": SchoolHolidaysModel,
  "STOPPAGE_MASTER": StoppageMasterModel,
  "STUDENT_MASTER": StudentMasterModel,
  "STUDENT_ATTENDANCE": StudentAttendanceModel,
  "STUDENT_ATTENDANCE_MESSAGE_LOG": StudentAttendanceMessageLogModel,
  "STUDENT_ATTENDANCE_CHECKBOX": StudentAttendanceCheckboxModel,
  "STUDENT_SUBSCRIPTION_MASTER": StudentSubscriptionMaster,
  "SETTINGS": SettingsModel,
  "PARENT_LOG": ParentLogModel,
  "COUNTRY_MASTER": CountryMasterModel,
  "TOKEN": TokenModel,
  "B2C_CONFIGURATION": B2C_CONFIGURATION,
  "PORTAL_MESSAGE_LOG": PortalMessageLogModel,
  "STUDENT_ATTENDANCE_NOTI_LOG": StudentAttendanceNotificationLogModel,
  "NOTIFICATION_LOG_MODEL": NotificationLogModel,
  "BUS_OPERATOR_ADS": BusOperatorAdsModel,
  "WEBHOOK_LOGS": WebhookLogsModel,
  "PAYMENT_LOGS": PaymentLogsModel,
  "USER_MASTER": UserMaster,
  "MDM_SIMCARD_DETAIL": MdmSimcardDetailsModel,

  "FEES_MASTER": FeesMasterModel,
  "FEES_COLLECTION": FeesCollectionModel,
  "FEES_MASTER_ZONEWIS": FeesMasterZonewisModel,
  "FEES_COLLECTION_ZONEWIS": FeesCollectionZonewiseModel,
  "USER_ROLE": UserRolesModel,
  "ROLE": RolesModel,
  "PAYMENT_SUB_ACCOUNTS": PaymentSubAccountsModel,
  "FEES_ZONEWISE_ERROR": FeesZonewiseErrorlogsModel,
  "STUDENT_FEES_PENALTY": StudentFeesPenaltyModel,
  "SCHOOL_FEES_DISCOUNT": SchoolFeesDiscountModel,

}
module.exports = {
  DB_MODELS
};