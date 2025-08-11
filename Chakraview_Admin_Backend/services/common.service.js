const Firebase = require('../configs/firebase/firebase');
const Push = require('../configs/firebase/push');
const dbService = require('./db.service');
const { DB_MODELS } = require('../constants/models.constant');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } = require('../configs/env.config');



const sendFirebasePushNotification = async (message, numbers) => {
    const numbersArr = numbers.split(',');
    let json = '';
    let response = '';
    for (let i = 0; i < numbersArr.length; i++) {
        let number = numbersArr[i];
        number = number.replace('91', '');

        const regId = number;

        const selMobileSession = await dbService.findAll(DB_MODELS.MOBILE_SESSIONS, { loginnumber: regId, status: 1, pushtoken: { [Op.ne]: '' } }, ['pushtoken'], true, null, null, 'msid', 'DESC', 3);

        if (selMobileSession.length > 0) {
            for (let j = 0; j < selMobileSession.length; j++) {
                const result = selMobileSession[j];
                const firebase = new Firebase();
                const push = new Push();

                const payload = {};
                payload['team'] = 'India';
                payload['score'] = '5.6';

                const title = "Notification";
                const pushType = 'individual';

                push.setTitle(title);
                push.setMessage(message);

                push.setImage('');
                push.setIsBackground(true);
                push.setPayload(payload);

                if (pushType === 'topic') {
                    json = push.getPush();
                    response = await firebase.sendToTopic('global', json);
                } else if (pushType === 'individual') {
                    json = push.getPush();
                    const regId1 = result['pushtoken'];
                    response = await firebase.send(regId1, message);
                }
            }
        }
    }
    return response;
}

//Send Email Function

const sendEmail = async (data) => {
    try {
        const { res, toUsersArray, templatePATH, templateParams, subject, html } = data;

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            auth: {
                user: SMTP_USERNAME,
                pass: SMTP_PASSWORD,
            },
        });
        const mailData = await dbService.findOne(DB_MODELS.SETTINGS, { name: 'Admin_Email' }, ['value']);
        const adminEmail = mailData.value;

        if (templatePATH) {
            templateParams.logo = "-----";

            return new Promise((resolve, reject) => {
                res.render(templatePATH, templateParams, async (err, templateHtml) => {
                    if (err) {
                        reject(err)  // calling `reject` will cause the promise to fail with or without the error passed as an argument
                        return;        // and we don't want to go any further
                    } else {

                        let email_response = await transporter.sendMail({
                            from: 'info@chakraview.co.in', // sender address
                            to: toUsersArray, // list of receivers
                            subject: subject, // Subject line
                            html: templateHtml, // html body
                        }).catch(function (e) {
                            reject(err)  // calling `reject` will cause the promise to fail with or without the error passed as an argument
                            return;
                        });
                        resolve(email_response);
                        return email_response;
                    }
                });
            });

        } else {
            return await transporter.sendMail({
                from: 'info@chakraview.co.in', // sender address
                to: `${adminEmail}`, // list of receivers
                // cc: ccUsersArray, // list of receivers
                // bcc: bccUsersArray, // list of receivers
                subject: subject, // Subject line
                // text, // plain text body
                html, // html body
                // attachments
            }).catch(function (e) {
                throw e;
            });
        }
    } catch (error) {
        throw error;
    }

};

const sendEmail2 = async (data) => {
    try {
        const { from = 'info@chakraview.co.in', toUsersArray, subject, html } = data;

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            auth: {
                user: SMTP_USERNAME,
                pass: SMTP_PASSWORD,
            },
        });

        return await transporter.sendMail({
            from: from, // sender address
            to: `${toUsersArray}`, // list of receivers
            // cc: ccUsersArray, // list of receivers
            // bcc: bccUsersArray, // list of receivers
            subject: subject, // Subject line
            // text, // plain text body
            html, // html body
            // attachments
        }).catch(function (e) {
            throw e;
        });

    } catch (error) {
        throw error;
    }

};

module.exports = {
    sendFirebasePushNotification,
    sendEmail,
    sendEmail2
}