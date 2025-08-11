// const { Sequelize } = require('sequelize');
const { DB_MODELS } = require('../constants/models.constant');

const getTodaySentNotificationsCount = async () => {
    try {
        const [results] = await DB_MODELS.STUDENT_ATTENDANCE.sequelize.query(`
            SELECT COUNT(id) AS sent_notification
            FROM notification_logs
            WHERE DATE(created_at) <= CURDATE()            
        `);
        // console.log(results[0]);

        return results[0];
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getTodaySentNotificationsCount
}