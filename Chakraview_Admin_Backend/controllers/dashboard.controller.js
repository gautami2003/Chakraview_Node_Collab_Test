const apiHelper = require("../helpers/api.helper");
const schoolService = require('../services/schoolMaster.service');
const busOperatorService = require('../services/busOperator.service');
const studentService = require('../services/student.service');
const studentAttendanceService = require('../services/student_attendance.service');
const busInchargeCount = require('../services/busInchargeMaster.service');

const { logError } = require("../utils/logger");

const { COMMON_MESSAGES } = require("../constants/messages.constant");
const { DB_MODELS } = require("../constants/models.constant");

const getDashboardCounts = async (req, res) => {
    const user = req.user;
    try {
        const roleSlugs = user.roles.map(role => role.slug);
        const isAdmin = roleSlugs.includes("admin");
        if (isAdmin) {
            const schools = await schoolService.getSchoolCount();
            const busOperators = await busOperatorService.getBusOperatorCount();
            const students = await studentService.getStudentCount();
            const result = await studentAttendanceService.getTodaySentNotificationsCount();

            return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { schools, busOperators, students, sent_notification: result.sent_notification });
        } else {
            const students = await studentService.getStudentCount(user.busOperatorID);
            const [attendanceResult] = await DB_MODELS.BUS_INCHARGE_MASTER.sequelize.query(`
                SELECT
                    COUNT(DISTINCT attendance.StudentID) AS StudentCount 
                FROM
                    bus_incharge_master AS bim
                    INNER JOIN student_attendance AS attendance ON bim.DriverID = attendance.DriverID
                    INNER JOIN school_master AS sm ON attendance.SchoolID = sm.SchoolID
                    INNER JOIN student_master AS stu ON attendance.StudentID = stu.StudentID 
                WHERE
                    DATE(attendance.DateTime) = CURDATE() 
                    AND attendance.BusOperatorID = ${user.busOperatorID}
                    AND attendance.RouteID IN (stu.FromRouteID, stu.ToRouteID);
            `);
            const [parentLogged] = await DB_MODELS.PARENT_LOG.sequelize.query(`
                SELECT COUNT(DISTINCT pl.StudentID) AS studentCount
                    FROM parent_log AS pl
                    JOIN student_master AS sm ON pl.StudentID = sm.StudentID
                    WHERE pl.BusOperatorID = ${user.busOperatorID}
                    AND DATE(pl.LoginDateTime) = CURRENT_DATE
                    AND sm.isDeleted = 'N';
          `);
            const result = await studentAttendanceService.getTodaySentNotificationsCount();

            return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, {
                students,
                studentsAttendance: attendanceResult[0].StudentCount || 0,
                parentLogged: parentLogged[0].studentCount || 0,
                sent_notification: result.sent_notification || 0
            });
        }


    } catch (error) {
        await logError(req, res, "dashboardController", "getDashboardCounts", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

module.exports = {
    getDashboardCounts
};
