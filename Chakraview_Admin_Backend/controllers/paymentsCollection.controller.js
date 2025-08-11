const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const cors = require('cors');
const crypto = require('crypto');
const uuid = require('uuid');
const { generateRandomString } = require("../helpers/common.helper");

const { CCA_MERCHANT_ID, CCA_ACCESS_CODE, CCA_WORKING_KEY, CCA_URL, BASE_URL, FRONT_END_URL } = require('../configs/env.config');
const { BAD_REQUEST, PAYMENT_REQUIRED, CONFLICT } = require("../constants/http-status-code.constant");

// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");

const ccaInitiatePayment = async (req, res) => {
    const { studentID, amount, grossAmount } = req.body;
    const redirectUrl = `${BASE_URL}/api/v1/payments-collection/cca/payment-response`;
    const cancelUrl = `${BASE_URL}/api/v1/payments-collection/cca/payment-cancel`;

    const getStudentData = await DB_MODELS.STUDENT_MASTER.findOne({
        attributes: ["EmailID", "SchoolID", "FatherName", "Year"],
        where: { StudentID: studentID }
    });

    let paymentData;
    if (getStudentData) {
        const orderId = generateRandomString() + "-" + studentID
        const getSubName = await DB_MODELS.PAYMENT_SUB_ACCOUNTS.findOne({
            where: { school_id: getStudentData.SchoolID }
        });

        await DB_MODELS.PAYMENT_LOGS.create({ payment_gateway: "CCavenue_fees_collection", logs: { "msg": "Initiate Payment", "order_id": orderId, "studentID": studentID } })

        const getFeesPanelty = await DB_MODELS.STUDENT_FEES_PENALTY.findOne({
            where: { school_id: getStudentData.SchoolID }
        });


        let totalAmount = amount;

        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;
        const shortYear = moment().format("YY")
        const year = `${previousYear}-${shortYear}`

        if (getStudentData.Year === year) {
            if (getFeesPanelty.penalty_amount) {
                totalAmount = getFeesPanelty.penalty_amount + amount
            }
        }

        paymentData = `merchant_id=${CCA_MERCHANT_ID}&currency=INR&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&language=EN&merchant_param1=${studentID}&merchant_param2=${grossAmount}&order_id=${orderId}&amount=${totalAmount}&cc_billing_name=${getStudentData.FatherName}&billing_email=${getStudentData.EmailID}`;

        if (getSubName) {
            paymentData += `&sub_account_id=${getSubName.sub_account_id}`
        }
        console.log(paymentData, "paymentDatapaymentDatapaymentData");

    } else {
        return apiHelper.success(res, "No data available", false, BAD_REQUEST);
    };

    const encRequest = encrypt(paymentData, CCA_WORKING_KEY);

    const result = {
        url: CCA_URL,
        access_code: CCA_ACCESS_CODE,
        encRequest: encRequest
    };

    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
};

const ccaPaymentResponse = async (req, res) => {
    const { encResp } = req.body;
    console.log("Response Received", encResp);

    await DB_MODELS.PAYMENT_LOGS.create({ payment_gateway: "Response Received", logs: {} });

    try {
        const decryptedResponse = decrypt(encResp, CCA_WORKING_KEY);
        const params = new URLSearchParams(decryptedResponse);
        const responseJson = Object.fromEntries(params.entries());

        let result = {};

        const paymentId = await DB_MODELS.PAYMENT_LOGS.create({ payment_gateway: "CCavenue_fees_collection", logs: responseJson })
        const encoded = Buffer.from(paymentId.id.toString()).toString('base64');
        let urlRedirect = `${FRONT_END_URL}/fees-collection/payment-status?token=${encoded}`;

        // Check payment status
        if (responseJson.order_status === "Success") {

            result = { ...result, ...responseJson }; // add all fields to the result variable.

            const getStudentData = await DB_MODELS.STUDENT_MASTER.findOne({
                attributes: ["SchoolCode", "BusOperatorID", "SchoolID", "AddressZone"],
                where: { StudentID: result.merchant_param1 },
                include: [
                    {
                        model: DB_MODELS.SCHOOL_MASTER,
                        attributes: ["SchoolName",],
                        where: { isDeleted: 'N' }
                    },
                ]
            });

            await DB_MODELS.FEES_COLLECTION_ZONEWIS.create({
                StudentID: result.merchant_param1,
                SchoolCode: getStudentData.SchoolCode,
                BusOperatorID: getStudentData.BusOperatorID,
                SchoolID: getStudentData.SchoolID,
                SchoolName: getStudentData.school_master?.SchoolName,
                AddressZone: getStudentData.AddressZone,
                Currency: "INR",
                ToalFeesPaidAmount: result.amount,
                Gross_Amount: result.merchant_param2,
                EmailIDForPayment: result.billing_email,
                PaymentDate: moment().format("YYYY MM DD, h:mm:ss"),
                ModeOfPayment: "Online",
                TxnIDFromPG: result.tracking_id,
                order_id: result.order_id,
                payment_gateway_response: decryptedResponse,
                isDeleted: "N",
                CreatedBy: "Parent",
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss"),
            });

            // return res.redirect(`http://localhost:3000/fees-collection/payment-success?token=${encoded}`);
            // urlRedirect += `?token=${encoded}`

        }
        // else if (responseJson.order_status === "Failure") {
        //     // await DB_MODELS.PAYMENT_LOGS.create({ payment_gateway: "Student Login CCavenue", logs: req.body })
        //     return apiHelper.success(res, responseJson.failure_message, result, responseJson);
        // }
        // else if (responseJson.order_status === "Aborted") {
        //     // await DB_MODELS.PAYMENT_LOGS.create({ payment_gateway: "Student Login CCavenue", logs: req.body })
        //     return apiHelper.success(res, responseJson.failure_message, result, responseJson);
        // }
        // else {
        //     // await DB_MODELS.PAYMENT_LOGS.create({ payment_gateway: "Student Login CCavenue", logs: req.body })
        //     return apiHelper.success(res, "Unknown Payment Status", {}, responseJson);
        // }

        return res.redirect(urlRedirect);

        // return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result, responseJson);

    } catch (error) {
        await logError(req, res, "payment.controller", "ccaPaymentResponse", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    };
}

const ccaPaymentCancel = async (req, res) => {
    try {
        await DB_MODELS.PAYMENT_LOGS.create({ payment_gateway: "CCavenue_fees_collection", logs: { "msg": "payment cancelled" } })

        return res.redirect(`${FRONT_END_URL}/fees-collection/payment-cancel`);

    } catch (error) {
        await logError(req, res, "payment.controller", "ccaPaymentCancel", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    };
}


const ccaCallback = async (req, res) => {
    const { id } = req.query;

    try {
        const getData = await DB_MODELS.PAYMENT_LOGS.findOne({
            attributes: ["logs"],
            where: { id: id }
        });


        const result = {
            order_id: getData.logs.order_id || "",
            txnIDFromPG: getData.logs.tracking_id || "",
            orderStatus: getData.logs.order_status || "",
            toalFeesPaidAmount: getData.logs.amount || "",
            dateTime: moment(getData.logs.trans_date, "DD/MM/YYYY HH:mm:ss").format("Do MMMM, YYYY  hh:mm") || ""
        }

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);

    } catch (error) {
        await logError(req, res, "payment.controller", "ccaCallback", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    };
}

// Function to convert Hex to Binary (same as PHP hextobin)
function hexToBin(hexString) {
    return Buffer.from(hexString, "hex");
}

// Function to convert Binary to Hex (same as PHP bin2hex)
function binToHex(binString) {
    return Buffer.from(binString, "binary").toString("hex");
}

// Function to encrypt (same as PHP)
function encrypt(plainText, key) {
    const formattedKey = crypto.createHash("md5").update(key).digest(); // MD5 hash of the key
    const iv = Buffer.from([
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
        0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
    ]); // Fixed IV

    const cipher = crypto.createCipheriv("aes-128-cbc", formattedKey, iv);
    let encrypted = cipher.update(plainText, "utf8", "binary");
    encrypted += cipher.final("binary");

    return binToHex(encrypted); // Convert to hex
}

// Function to decrypt (same as PHP)
function decrypt(encryptedText, key) {
    const formattedKey = crypto.createHash("md5").update(key).digest(); // MD5 hash of the key
    const iv = Buffer.from([
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
        0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
    ]); // Fixed IV

    const decipher = crypto.createDecipheriv("aes-128-cbc", formattedKey, iv);
    let decrypted = decipher.update(hexToBin(encryptedText), "binary", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}


module.exports = {
    ccaInitiatePayment,
    ccaPaymentResponse,
    ccaPaymentCancel,
    ccaCallback,
};
