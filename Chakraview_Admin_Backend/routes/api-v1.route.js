const express = require('express');
const router = express.Router();

router.use('/dashboard', require('./api/dashboard.route'));
router.use('/auth', require('./api/auth.route'));
router.use('/parent', require('./api/parent.route'));
router.use('/bus-operator', require('./api/busOperator.route'));
router.use('/busMaster', require('./api/busMaster.route'));
router.use('/schoolMaster', require('./api/schoolMaster.route.js'));
router.use('/mdmSimcards', require('./api/mdmSimcards.route'));
router.use('/mdmDevices', require('./api/mdmDevices.route'));
router.use('/mdmAllocation', require('./api/mdmAllocation.route'));
router.use('/pickupRouteMaster', require('./api/pickupRouteMaster.route'));
router.use('/parentLogMaster', require('./api/parentLogMaster.route'));
router.use('/studentAttendanceReport', require('./api/studentAttendanceReport.route'));
router.use('/drop-route-master', require('./api/dropRouteMaster.route'));
router.use('/bus-incharge-master', require('./api/busInchargeMaster.route'));
router.use('/bus-stoppage', require('./api/busStoppage.route'));
router.use('/route-stoppage-timing', require('./api/routeStoppageTiming.route'));
router.use('/students', require('./api/students.route'));
router.use('/gps', require('./api/gps.route'));
router.use('/public', require('./api/public.route'));
router.use('/country', require('./api/country.route'));
router.use('/city', require('./api/city.route'));
router.use('/user-master', require('./api/userMaster.route'));
router.use('/fees-master-zonewise', require('./api/feesMasterZonewise.route'));
router.use('/fees-collection-zoneWise', require('./api/feesCollectionZoneWise.route'));
router.use('/fees-master-studentwise', require('./api/feesMasterStudentwise.route'));
router.use('/payments-collection', require('./api/paymentsCollection.route'));
router.use('/paymentSub', require('./api/paymentSub.route'));
router.use('/school-holidays', require('./api/schoolHoliday.route'));
router.use('/fees-collection', require('./api/feesCollection.route'));
router.use('/studentAttendanceNotificationLog', require('./api/studentAttendanceNotificationLog.route'));
router.use('/notificationLog', require('./api/NotificationLog.route'));
router.use('/portalLog', require('./api/PortalLog.route'));
router.use('/distanceMessageReport', require('./api/distanceMessageReport.route'));



module.exports = router;
