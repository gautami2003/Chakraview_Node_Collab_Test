const { postMqttMessage } = require("../helpers/rabbitmq.helper");
const { DB_MODELS } = require('../constants/models.constant');
const { sendEmail } = require("../services/common.service");
const moment = require('moment');
const logError = async function (req, res, file, functionName, error, other = {}) {
    try {
        let errorData = {};
        let stack = "";

        if (error.name === 'SequelizeDatabaseError') {
            errorData = error;
            stack = error.stack;
        } else {
            stack = error.stack;
        }

        let request_payload = req ? { body: req.body, params: req.params, query: req.query } : { body: {}, params: {}, query: {} };

        if (request_payload?.body?.password) {
            request_payload.body.password = 'REMOVED';
        }

        if (request_payload?.params?.password) {
            request_payload.params.password = 'REMOVED';
        }

        if (request_payload?.query?.password) {
            request_payload.query.password = 'REMOVED';
        }

        request_payload = JSON.stringify(request_payload);

        const errorEmailData = await DB_MODELS.Api_Error_Logs.create({
            // user_id: req && req.user?.user_id,
            request_url: req ? req.protocol + '://' + req.get('host') + req.originalUrl : null,
            request_payload,
            function: `${file}->${functionName}`,
            message: error?.message,
            stack: JSON.stringify({ error: errorData, stack }),
            // status: 'PENDING',
            // server: 'Attendant',
            created_at: moment().toString(),
        });

        const error_emails_data = {
            toUsersArray: ["hello@anhasweb.com"],
            subject: 'Chakraview Error - Parent API',
            id: errorEmailData.id
        }

        await postMqttMessage('error_emails', JSON.stringify(error_emails_data))
        console.log(error);


    } catch (e) {
        console.error("<<<<<<<<<<<<<<<< ERROR OCCURRED >>>>>>>>>>>>>>>>");
        console.error({ file, functionName, error, e });
    }
}

module.exports = {
    logError
}