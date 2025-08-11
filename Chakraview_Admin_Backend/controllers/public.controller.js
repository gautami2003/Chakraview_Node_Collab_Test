const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;


// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { AUTH_MESSAGES, COMMON_MESSAGES, ROUTE_MESSAGES, ERROR_CODES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");
const { postMqttMessage } = require("../helpers/rabbitmq.helper");
const e = require("cors");


const mmiWebhook = async (req, res) => {
    try {
        // console.log(":: WEBHOOK LOGS STARTED ::");
        // console.log(req.body);
        // console.log(":: WEBHOOK LOGS ENDED ::");

        for (let index = 0; index < req.body.length; index++) {
            const data = req.body[index];

            let result = {
                vehicleName: data?.vehicleName || "",
                timestamp: data?.timestamp || "",
                longitude: data?.longitude || "",
                latitude: data?.latitude || "",
                speed: data?.speed || "",
            };

            // Get stoppages
            const studentRecords = await DB_MODELS.STUDENT_MASTER.findAll({
                attributes: ["FromStoppageID", "ToStoppageID"],
                where: { BusName: result.vehicleName },
                // logging: console.log
            });

            const uniqueStoppageIDs = [
                ...new Set(studentRecords.flatMap(({ FromStoppageID, ToStoppageID }) => [FromStoppageID, ToStoppageID]))
            ];

            const stoppages = await DB_MODELS.STOPPAGE_MASTER.findAll({
                attributes: ['StopageName', 'Latitude', 'Longitude'],
                where: { StoppageID: { [Op.in]: uniqueStoppageIDs } },
                // logging: console.log
            });

            result['stoppages'] = stoppages.map(stoppage => stoppage.get({ plain: true }));

            await postMqttMessage(`gps_${result.vehicleName}`, JSON.stringify(result))
            await DB_MODELS.WEBHOOK_LOGS.create({ logs: req.body })
        }

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, req.body);
    }
    catch (error) {
        console.log(error);
        await logError(req, res, "publicController", "mmiWebhook", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
}


module.exports = {
    mmiWebhook
};
