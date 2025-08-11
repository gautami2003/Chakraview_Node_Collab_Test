const { v1: uuid } = require("uuid");
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");
const axios = require("axios");
// Helper
const apiHelper = require("../helpers/api.helper");
const { jwtGenerator, refreshAccessToken } = require("../helpers/jwt.helper");
const { logError } = require("../utils/logger");

// Services
const userService = require("../services/user.service");
const dbService = require("../services/db.service");
const redisService = require("../services/redis.service");

// Constants
const { DB_MODELS } = require("../constants/models.constant");
const { BAD_REQUEST, NOT_FOUND, CREATED } = require("../constants/http-status-code.constant");
const { AUTH_MESSAGES, COMMON_MESSAGES, ERROR_CODES } = require("../constants/messages.constant");
const { USER_STATUS } = require("../constants/user-status.constant");

// Sequalize
const { Op } = require("sequelize");
const { TXTGURU_SMS_API, TEXTGURU_SMS_USERNAME, TEXTGURU_SMS_PASSWORD, TEXTGURU_SMS_SOURCE } = require("../configs/env.config");
const crypto = require("crypto");
const { sendEmail2 } = require("../services/common.service");

const login = async (req, res, next) => {
  const { userName, password, } = req.body;
  const md5Password = crypto.createHash("md5").update(password).digest("hex");

  try {
    const userLogin = await DB_MODELS.USER_MASTER.findOne({
      where: { UserName: userName, Password: md5Password },
      attributes: ["UserID", "UserName", "Password"],
      include: [
        {
          model: DB_MODELS.ROLE,
          attributes: ["slug"],
          through: { attributes: [] } // to exclude user_roles fields
        }
      ]
    });

    if (userLogin) {
      const selBusOperatorID = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
        where: { UserID: userLogin.UserID },
        attributes: ["BusOperatorID", "isActive", "isDeleted"],
        include: [
          {
            model: DB_MODELS.CONFIGURATION_SMS_LONGCODE_CALL,
            attributes: ["MessageProviderURL2", "isNotification", "isTypePortalMobileNofication", "isStoppageUpdatable", "isSMS", "isTypePortalSMS"],
            required: true
          },
        ],
      });

      const busOperatorID = selBusOperatorID.BusOperatorID;
      const userID = userLogin.UserID;
      if (selBusOperatorID.isActive == 'N' || selBusOperatorID.isDeleted == 'Y') {
        return apiHelper.success(res, AUTH_MESSAGES.ACCOUNT_NOTACTIVED, {}, {}, false);
      }
      const cleanUser = userLogin.get({ plain: true });
      // console.log(cleanUser);
      let token = jwtGenerator({ userID, userName, busOperatorID, roles: cleanUser["roles"] });
      // const data = {
      //   UserName: userName,
      //   BusOperatorID: selBusOperatorID?.BusOperatorID || "",
      //   isActive: selBusOperatorID?.isActive || "",
      //   token: token.token,
      //   messageProviderURL2: selBusOperatorID.configuration_sms_longcode_call?.MessageProviderURL2 || "",
      //   NotificationPassword: userLogin?.Notification_Password || ""
      // }

      return apiHelper.success(res, AUTH_MESSAGES.LOGIN, token);
    } else {
      return apiHelper.success(res, AUTH_MESSAGES.LOGIN_ERROR, {}, {}, false);
    }
  } catch (error) {
    await logError(req, res, "authController", "login", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.UNKNOWN_ERROR, error.message);
  }
};


const launchUser = async (req, res, next) => {
  const { userID, busOperatorId } = req.body;

  try {
    const user = await DB_MODELS.USER_MASTER.findOne({
      where: { UserID: userID },
      attributes: ["UserID", "UserName"],
      include: [
        {
          model: DB_MODELS.ROLE,
          attributes: ["slug"],
          through: { attributes: [] }
        }
      ]
    });

    if (!user) {
      return apiHelper.success(res, AUTH_MESSAGES.LOGIN_ERROR, {}, {}, false);
    }

    const busOperator = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
      where: { UserID: userID, BusOperatorID: busOperatorId, isDeleted: 'N' },
      attributes: ["BusOperatorID"]
    });

    if (!busOperator) {
      return apiHelper.success(res, AUTH_MESSAGES.ACCOUNT_NOTACTIVED, {}, {}, false);
    }

    const cleanUser = user.get({ plain: true });

    const token = jwtGenerator({
      userID,
      userName: cleanUser.UserName,
      busOperatorID: busOperator.BusOperatorID,
      roles: cleanUser["roles"]
    });
    return apiHelper.success(res, AUTH_MESSAGES.LOGIN, token);
  }
  catch (error) {
    await logError(req, res, "authController", "launchUser", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.UNKNOWN_ERROR, error.message);
  }
};


const signup = async (req, res) => {
  try {
    const {
      busOperatorName,
      countryID,
      address1,
      address2,
      cityID,
      pincode,
      phoneNumber,
      ownerName,
      ownerPhoneNumber,
      emailID,
      websiteURL,
      businessType,
      userName,
      password,
    } = req.body;

    const md5Password = crypto.createHash("md5").update(password).digest("hex");

    const selEmail = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
      where: { EmailID: emailID, isDeleted: 'N' },
      attributes: ["EmailID"]
    });

    const selUserName = await DB_MODELS.USER_MASTER.findOne({
      where: { UserName: userName },
      attributes: ["UserName"],
      include: [
        {
          model: DB_MODELS.BUS_OPERATOR_MASTER,
          required: true,
          where: { isDeleted: 'N' },
          attributes: []
        }
      ]
    });

    if (selEmail) {
      return apiHelper.success(res, AUTH_MESSAGES.EMAIL_EXISTS, {}, {}, false);
    } else if (selUserName) {
      return apiHelper.success(res, AUTH_MESSAGES.USERNAME_EXISTS, {}, {}, false);
    } else {

      await DB_MODELS.BUS_OPERATOR_MASTER.create({
        BusOperatorName: busOperatorName,
        CountryID: countryID,
        Address1: address1,
        Address2: address2,
        CityID: cityID,
        Pincode: pincode,
        PhoneNumber: phoneNumber,
        EmailID: emailID,
        WebsiteURL: websiteURL,
        BusinessType: businessType,
        TimeZone: "Asia/Kolkata",
        OwnerName: ownerName,
        OwnerPhoneNumber: ownerPhoneNumber,
        isActive: 'N',
        TC: 'Y',
        isPhone: 'N',
        isDeleted: 'N',
        CreatedBy: "Admin",
        CreatedOn: moment().format("YYYY MM DD, h:mm:ss"),
      });

      const lastBusOperator = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
        attributes: ["BusOperatorID"],
        order: [["BusOperatorID", "DESC"]],
        limit: 1
      });

      const busOperatorID = lastBusOperator.BusOperatorID;

      await DB_MODELS.USER_MASTER.create({
        ParentUserID: '1',
        UserName: userName,
        Password: md5Password,
        CreatedBy: "Admin",
        CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
      });

      const lastUser = await DB_MODELS.USER_MASTER.findOne({
        attributes: ["UserID"],
        order: [["UserID", "DESC"]],
        limit: 1
      });

      const userID = lastUser.UserID;

      await DB_MODELS.BUS_OPERATOR_MASTER.update(
        { UserID: userID },
        { where: { BusOperatorID: busOperatorID } }
      );

      await DB_MODELS.CONFIGURATION_SMS_LONGCODE_CALL.create({
        BusOperatorID: busOperatorID,
        isPhone: "N",
        isStoppageUpdatable: "N",
        isLongcode: "N",
        Longcode: "9212356070",
        OfflineLatlongSMSFrequency: "60",
        isSMS: "N",
        MessageProviderURL1: `${TXTGURU_SMS_API}?username=chakraviewindia&password=Samyak1708&source=CHKRVI&dmobile=`,
        MessageProviderURL2: `${TXTGURU_SMS_API}?username=chakraviewindia&password=Samyak1708&source=CHKRVI&dmobile=`,
        isTypeDistanceMessage: "N",
        isTypeSMS2: "N",
        isTypeSMS3: "N",
        isTypeIndividualSMS: "N",
        isTypeGroupSMS: "N",
        isTypePortalSMS: "N",
        isLateStartSMSToBusOperator: "N",
        SMSServiceDisableMessage: "This service is disabled now. Please contact admin to enable it.",
        IndividualSMS1: "Your child has boarded the bus from home",
        IndividualSMS2: "There is no one to pick the child at drop stoppage",
        IndividualSMS3: "Bus is delayed by a few minutes due to slow traffic",
        IndividualSMS4: "Bus is delayed by a few minutes due to technical reasons",
        IndividualSMS5: "Your child has reached home",
        GroupSMS1: "Bus is delayed by a few minutes due to slow traffic.",
        GroupSMS2: "Bus is delayed by a few minutes due to technical reasons.",
        GPSInterval: "8",
        DistanceInterval: "30",
        CreatedBy: "Admin",
        CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
      });
    };
    return apiHelper.success(res, AUTH_MESSAGES.SIGNUP);
  } catch (error) {
    await logError(req, res, "authController", "signup", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.UNKNOWN_ERROR, error.message);
  }
};

const forgotUsernamepPassword = async (req, res) => {
  const { action, emailID } = req.body;

  try {
    if (action == "username") {
      const selUserDetails = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
        where: { EmailID: emailID, isDeleted: 'N' },
        attributes: ["BusOperatorName", "UserID", "EmailID"]
      });
      if (selUserDetails) {
        await sendEmail2({
          toUsersArray: emailID,
          subject: 'Reset Your Password',
          html: `Hi ${selUserDetails.BusOperatorName}<br/>
          Please click on the link below to reset your password: <br/>
          <a href="https://admin.chakraview.co.in/schoolbustracker/reset_password.php?id=${selUserDetails.UserID}">
          Click Here To Change Password
          </a>`
        });

      } else {
        return apiHelper.success(res, AUTH_MESSAGES.EMAILID_NOT_REGISTERED, {}, {}, false);
      }
    } else if (action == "password") {
      const selUserDetails = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
        where: { EmailID: emailID, isDeleted: 'N' },
        attributes: ["BusOperatorName", "UserID", "EmailID"]
      });
      if (selUserDetails) {
        await sendEmail2({
          toUsersArray: emailID,
          subject: 'Reset Your Password',
          html: `Hi ${selUserDetails.BusOperatorName}<br/>
        Please click on the link below to reset your password: <br/>
        <a href="https://admin.chakraview.co.in/schoolbustracker/reset_password.php?id=${selUserDetails.UserID}">
        Click Here To Change Password
        </a>`
        });

      } else {
        return apiHelper.success(res, AUTH_MESSAGES.EMAILID_NOT_REGISTERED, {}, {}, false);
      }
    };
    return apiHelper.success(res, AUTH_MESSAGES.EMAIL_SEND);
  } catch (error) {
    await logError(req, res, "authController", "forgotUsernamepPassword", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.UNKNOWN_ERROR, error.message);
  }
};

const resetPassword = async (req, res) => {
  const { userID, password, updatedBy, updatedOn } = req.body;
  const md5Password = crypto.createHash("md5").update(password).digest("hex");

  try {

    const updatePassword = await DB_MODELS.USER_MASTER.update(
      { password: md5Password, UpdatedBy: updatedBy, UpdatedOn: updatedOn },
      { where: { UserID: userID } }
    );
    return apiHelper.success(res, AUTH_MESSAGES.SIGNUP);
  } catch (error) {
    await logError(req, res, "authController", "resetPassword", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.UNKNOWN_ERROR, error.message);
  }
};

const logout = async (req, res) => {

  try {
    const bearerHeader = req.headers["authorization"];
    const bearerToken = bearerHeader.split(" ")[1];
    const checkToken = await dbService.getOne(DB_MODELS.TOKEN, {
      token: bearerToken,
    });
    if (checkToken) {
      return apiHelper.failure(res, AUTH_MESSAGES.LOGOUT_ERROR);
    }

    await dbService.createOne(DB_MODELS.TOKEN, { token: bearerToken });
    return apiHelper.success(res, AUTH_MESSAGES.LOGOUT);
  } catch (error) {
    await logError(req, res, "authcontroller", "logout", error, {});
    return apiHelper.failure(res, error.message);
  }
};

const studentlogin = async (req, res, next) => {
  const { phoneNumber, OTP } = req.body;

  const nowdt = moment();
  const expdt = moment(nowdt).add(30, "days");

  try {
    const key = `parent_login_otp_${phoneNumber} `;
    const sentOTP = await redisService.getRedisValue(key);

    if (sentOTP) {
      // const sentOTP = await redisService.getRedisValue(key);

      if (sentOTP == OTP) {
        await redisService.deleteFromRedis(key);
      }
      else {
        return apiHelper.success(res, AUTH_MESSAGES.MISMATCH_OTP, {}, {}, false);
      };
    }
    else {
      return apiHelper.success(res, AUTH_MESSAGES.MISMATCH_OTP, {}, {}, false);
    };
    const studentRecord = await DB_MODELS.STUDENT_MASTER.findOne({
      where: {
        [Op.or]: [
          { FatherMobileNumber: phoneNumber },
          { OtherMobileNumber: phoneNumber },
          { MotherMobileNumber: phoneNumber },
        ],
      },
      order: [["StudentID", "DESC"]], // Assuming there's an 'id' column to find the latest row
    });

    if (!studentRecord) {
      return apiHelper.failure(
        res,
        ERROR_CODES.A1001,
        {},
        BAD_REQUEST
      );
    }

    let token = jwtGenerator({ phoneNumber });

    // return apiHelper.success(res, AUTH_MESSAGES.OTP_VERIFIED, {});
    return apiHelper.success(res, AUTH_MESSAGES.LOGIN, { ...token, ValidUpto: expdt.format("YYYY-MM-DD HH:mm:ss") });
  } catch (error) {
    await logError(req, res, "authController", "studentlogin", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.UNKNOWN_ERROR, error.message);
  }
};


const studentLoginGenerateOTP = async (req, res) => {
  try {
    const { phoneNumber, sandbox } = req.body;
    const studentRecord = await DB_MODELS.STUDENT_MASTER.findOne({
      where: {
        [Op.or]: [
          { FatherMobileNumber: phoneNumber },
          { MotherMobileNumber: phoneNumber },
          { OtherMobileNumber: phoneNumber },
        ],
        isDeleted: "N",
      },
      order: [["StudentID", "DESC"]]
    });

    if (!studentRecord) {
      return apiHelper.failure(
        res,
        COMMON_MESSAGES.NOT_REGIS_CONTACT_ADMIN,
        "",
        NOT_FOUND
      );
    };

    const OTP = Math.floor(1000 + Math.random() * 9000);

    await redisService.setRedisValue(`parent_login_otp_${phoneNumber} `, OTP, 300);

    let smsUrl;
    if (sandbox === "1") {
      return apiHelper.success(res, AUTH_MESSAGES.OTP_SENT, { phone: phoneNumber }, { OTP: OTP });
    } else {
      smsUrl = `${process.env.TXTGURU_SMS_API}?username=${process.env.TEXTGURU_SMS_USERNAME}&password=${process.env.TEXTGURU_SMS_PASSWORD}&source=${process.env.TEXTGURU_SMS_SOURCE}&dmobile=+91${phoneNumber}&dlttempid=1107164380930637067&message=${encodeURIComponent(
        `Login OTP for ChakraView is ${OTP} CHkRVI`
      )}`
    };
    await axios.get(smsUrl);

    return apiHelper.success(res, AUTH_MESSAGES.OTP_SENT, { phone: phoneNumber });
  }
  catch (error) {
    await logError(req, res, "authController", "studentLoginGenerateOTP", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const studentlogout = async (req, res) => {
  try {
    const bearerHeader = req.headers["authorization"];
    const bearerToken = bearerHeader.split(" ")[1];
    const checkToken = await dbService.getOne(DB_MODELS.TOKEN, {
      token: bearerToken,
    });
    if (checkToken) {
      return apiHelper.failure(res, AUTH_MESSAGES.LOGOUT_ERROR);
    }

    await dbService.createOne(DB_MODELS.TOKEN, { token: bearerToken });
    return apiHelper.success(res, AUTH_MESSAGES.LOGOUT);
  } catch (error) {
    await logError(req, res, "authcontroller", "studentlogout", error, {});
    return apiHelper.failure(res, error.message);
  }
};

const studentSignup = async (req, res) => {
  try {
    const {
      busOperatorName,
      countryID,
      address1,
      address2,
      cityID,
      pincode,
      phoneNumber,
      ownerName,
      ownerPhoneNumber,
      emailID,
      websiteURL,
      businessType,
      userName,
      password,
    } = req.body;

    const md5Password = crypto.createHash("md5").update(password).digest("hex");

    const selEmail = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
      where: { EmailID: emailID, isDeleted: 'N' },
      attributes: ["EmailID"]
    });

    const selUserName = await DB_MODELS.USER_MASTER.findOne({
      where: { UserName: userName },
      attributes: ["UserName"],
      include: [
        {
          model: DB_MODELS.BUS_OPERATOR_MASTER,
          required: true,
          where: { isDeleted: 'N' },
          attributes: []
        }
      ]
    });

    if (selEmail) {
      return apiHelper.success(res, AUTH_MESSAGES.EMAIL_EXISTS, {}, {}, false);
    } else if (selUserName) {
      return apiHelper.success(res, AUTH_MESSAGES.USERNAME_EXISTS, {}, {}, false);
    } else {

      await DB_MODELS.BUS_OPERATOR_MASTER.create({
        BusOperatorName: busOperatorName,
        CountryID: countryID,
        Address1: address1,
        Address2: address2,
        CityID: cityID,
        Pincode: pincode,
        PhoneNumber: phoneNumber,
        EmailID: emailID,
        WebsiteURL: websiteURL,
        BusinessType: businessType,
        TimeZone: "Asia/Kolkata",
        OwnerName: ownerName,
        OwnerPhoneNumber: ownerPhoneNumber,
        isActive: 'N',
        TC: 'Y',
        isPhone: 'N',
        isDeleted: 'N',
        CreatedBy: "Admin",
        CreatedOn: moment().format("YYYY MM DD, h:mm:ss"),
      });

      const lastBusOperator = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
        attributes: ["BusOperatorID"],
        order: [["BusOperatorID", "DESC"]],
        limit: 1
      });

      const busOperatorID = lastBusOperator.BusOperatorID;

      await DB_MODELS.USER_MASTER.create({
        ParentUserID: '1',
        UserName: userName,
        Password: md5Password,
        CreatedBy: "Admin",
        CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
      });

      const lastUser = await DB_MODELS.USER_MASTER.findOne({
        attributes: ["UserID"],
        order: [["UserID", "DESC"]],
        limit: 1
      });

      const userID = lastUser.UserID;

      await DB_MODELS.BUS_OPERATOR_MASTER.update(
        { UserID: userID },
        { where: { BusOperatorID: busOperatorID } }
      );

      await DB_MODELS.CONFIGURATION_SMS_LONGCODE_CALL.create({
        BusOperatorID: busOperatorID,
        isPhone: "N",
        isStoppageUpdatable: "N",
        isLongcode: "N",
        Longcode: "9212356070",
        OfflineLatlongSMSFrequency: "60",
        isSMS: "N",
        MessageProviderURL1: `${TXTGURU_SMS_API}?username = chakraviewindia & password=Samyak1708 & source=CHKRVI & dmobile=`,
        MessageProviderURL2: `${TXTGURU_SMS_API}?username = chakraviewindia & password=Samyak1708 & source=CHKRVI & dmobile=`,
        isTypeDistanceMessage: "N",
        isTypeSMS2: "N",
        isTypeSMS3: "N",
        isTypeIndividualSMS: "N",
        isTypeGroupSMS: "N",
        isTypePortalSMS: "N",
        isLateStartSMSToBusOperator: "N",
        SMSServiceDisableMessage: "This service is disabled now. Please contact admin to enable it.",
        IndividualSMS1: "Your child has boarded the bus from home",
        IndividualSMS2: "There is no one to pick the child at drop stoppage",
        IndividualSMS3: "Bus is delayed by a few minutes due to slow traffic",
        IndividualSMS4: "Bus is delayed by a few minutes due to technical reasons",
        IndividualSMS5: "Your child has reached home",
        GroupSMS1: "Bus is delayed by a few minutes due to slow traffic.",
        GroupSMS2: "Bus is delayed by a few minutes due to technical reasons.",
        GPSInterval: "8",
        DistanceInterval: "30",
        CreatedBy: "Admin",
        CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
      });
    };
    return apiHelper.success(res, AUTH_MESSAGES.SIGNUP);
  } catch (error) {
    await logError(req, res, "authController", "studentSignup", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.UNKNOWN_ERROR, error.message);
  }
};

module.exports = {
  login,
  signup,
  logout,
  forgotUsernamepPassword,
  resetPassword,
  studentlogin,
  studentlogout,
  studentSignup,
  studentLoginGenerateOTP,
  launchUser
};
