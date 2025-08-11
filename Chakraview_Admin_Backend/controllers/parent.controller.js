const sequelize_connection = require("../configs/db-connection.config");
const { Sequelize, QueryTypes } = require("sequelize");
const Op = Sequelize.Op;
const { sendEmail } = require("../services/common.service");
const { parseStringPromise } = require('xml2js');
const path = require("path")
const fs = require("fs")
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");

// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { AUTH_MESSAGES, COMMON_MESSAGES, ROUTE_MESSAGES, ERROR_CODES } = require("../constants/messages.constant");

// Services.
// const dbService = require("../services/db.service");
const redisService = require("../services/redis.service");

// Helpers.
const { getCurrentDate, getTimeZoneByBusOperatorID, prepareResponse, prepareListResponse, getMimeTypeFromBase64, getFileExtension, } = require("../helpers/common.helper");
const apiHelper = require("../helpers/api.helper");
// const { postMqttMessage } = require("../helpers/rabbitmq.helper");
// const { jwtGenerator, refreshAccessToken } = require("../helpers/jwt.helper");
const { logError } = require("../utils/logger");
const { BAD_REQUEST, CREATED, NOT_FOUND, FORBIDDEN } = require("../constants/http-status-code.constant");
const axios = require("axios");
const { uploadFile, deleteFile } = require("../services/s3.service");
const { AWS_CLOUD_FRONT_URL } = require("../configs/env.config");

const syncData = async (req, res) => {
  const { optype, mobileNumber, IMEINumber, sNo, app_version, oSType } = req.query;
  try {
    let isPushToken
    const selCheckVerQuery = await DB_MODELS.MOBILE_SESSIONS.findOne({
      attributes: ["app_version", "pushtoken"],
      where: { loginnumber: mobileNumber }
    })

    const pushtoken = selCheckVerQuery.dataValues.pushtoken
    if (!pushtoken || pushtoken == "") {
      isPushToken = "N"
    } else {
      isPushToken = "Y"
    }

    const studentMaster = await DB_MODELS.STUDENT_MASTER.findOne({
      where: {
        [Op.or]: [
          { FatherMobileNumber: mobileNumber },
          { MotherMobileNumber: mobileNumber },
          { OtherMobileNumber: mobileNumber }
        ],
        isDeleted: 'N'
      },
      attributes: ['isBan', 'IMEINumber'],
    });

    if (!studentMaster) {
      return apiHelper.success(res, "P2002 - Mobile number is not registered yet. Please contact Admin.", {});
    }

    // const isBan = studentMaster.isBan;
    // const oldIMEINumber = studentMaster.IMEINumber;

    const schools = await DB_MODELS.STUDENT_MASTER.findAll({
      where: {
        [Op.or]: [
          { FatherMobileNumber: mobileNumber },
          { MotherMobileNumber: mobileNumber },
          { OtherMobileNumber: mobileNumber }
        ],
        isDeleted: 'N'
      },
      include: [
        {
          model: DB_MODELS.SCHOOL_MASTER,
          required: true,
          where: { isDeleted: 'N' },
          attributes: ['SchoolID', 'SchoolName', 'Address1', 'Address2', 'Latitude', 'Longitude'],
        },
        {
          model: DB_MODELS.BUS_OPERATOR_MASTER,
          required: true,
          where: { isDeleted: 'N' },
          attributes: ['BusOperatorID', 'BusinessType', 'BusOperatorName', 'EmailID', 'OwnerName', 'OwnerPhoneNumber']
        }
      ],
    });

    if (schools.length === 0) {
      return apiHelper.success(res, "There is no data available. Please contact Support", { code: "520" });
    };

    const newSchools = [...schools];
    const finalResponse = [];

    for (let index = 0; index < newSchools.length; index++) {
      let result = newSchools[index];
      const busOperator = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
        where: {
          BusOperatorID: newSchools[index].BusOperatorID,
          isDeleted: 'N'
        },
        attributes: ['BusOperatorID', 'BusinessType']
      });

      const primaryStreaming = await DB_MODELS.CONFIGURATION_SMS_LONGCODE_CALL.findOne({
        where: { BusOperatorID: busOperator.BusOperatorID },
        attributes: ["primary_streaming_method", "streaming_iot_device"],
        raw: true
      });

      let gpsTracking = 0;

      if (primaryStreaming?.streaming_iot_device === 1 && newSchools[index].dataValues.BusName != null && primaryStreaming?.primary_streaming_method === "gps" && newSchools[index].dataValues.BusName != "") {
        gpsTracking = 1
      };

      if (busOperator.BusinessType === 'B2B') {
        busOperatorPhoneNumberQuery = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
          where: { BusOperatorID: busOperator.BusOperatorID },
          include: [
            {
              model: DB_MODELS.BUS_OPERATOR_ADS,
              required: true,
              attributes: ['AdsImgURL', 'CTAType']
            }
          ],
          attributes: ['PhoneNumber', 'isPhone', 'isFees', 'BusinessType', 'BusOperatorName', 'EmailID', 'OwnerName', 'OwnerPhoneNumber']
        });
      }

      else {
        busOperatorPhoneNumberQuery = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
          where: { BusOperatorID: busOperator.BusOperatorID },
          include: [
            {
              model: DB_MODELS.B2C_CONFIGURATION,
              required: true,
              attributes: ['isB2CPayment'],
            },
            {
              model: DB_MODELS.BUS_OPERATOR_ADS,
              required: true,
              attributes: ['AdsImgURL', 'CTAType']
            }
          ],
          attributes: ['PhoneNumber', 'isPhone', 'isFees', 'BusinessType', 'BusOperatorName', 'EmailID', 'OwnerName', 'OwnerPhoneNumber'],
          limit: 1,
        });
      };

      const schoolData = {
        BusOperatorID: busOperator.BusOperatorID,
        BusName: newSchools[index].BusName,
        StudentID: result.StudentID,
        StudentName: result.StudentName,
        SchoolID: result.school_master.SchoolID || '',
        SchoolCode: result.SchoolCode,
        LoginParentRelationship: mobileNumber === result.FatherMobileNumber ? 'Father' : mobileNumber === result.MotherMobileNumber ? 'Mother' : result.PrimaryMobileNumberOf,
        LoginParentName: mobileNumber === result.FatherMobileNumber ? result.FatherName : mobileNumber === result.MotherMobileNumber ? result.MotherName : result.PrimaryMobileNumberOf === 'Mother' ? result.MotherName : result.FatherName,
        SchoolSection: result.SchoolSection,
        StudentStandard: result.StudentStandard,
        StudentClass: result.StudentClass,
        SchoolName: `${result.school_master.SchoolName} (${result.SchoolSection || ''})`,
        StudentPhoto: newSchools[index].Student_Img ? `${AWS_CLOUD_FRONT_URL}/${newSchools[index].Student_Img}` : '',
        Address: `${result.school_master.Address1}${result.school_master.Address2 ? ', ' + result.school_master.Address2 : ''}`,
        Route: await getStudentRouteInfo(result.StudentID, result.school_master.SchoolID, false, busOperator.BusinessType),
        BusOperatorPhoneNumber: busOperatorPhoneNumberQuery?.PhoneNumber,
        isB2CPayment: busOperatorPhoneNumberQuery?.b2c_configuration?.isB2CPayment || "",
        BusinessType: busOperatorPhoneNumberQuery?.BusinessType || "",
        BusOperatorName: busOperatorPhoneNumberQuery?.BusOperatorName || "",
        EmailID: busOperatorPhoneNumberQuery?.EmailID || "",
        OwnerName: busOperatorPhoneNumberQuery?.OwnerName || "",
        OwnerPhoneNumber: busOperatorPhoneNumberQuery?.OwnerPhoneNumber || "",
        isGoogleAds: busOperatorPhoneNumberQuery?.isGoogleAds || "",
        GoogleAdsAPIKey: busOperatorPhoneNumberQuery?.GoogleAdsAPIKey || "",
        isPhone: busOperatorPhoneNumberQuery?.isPhone,
        isFees: busOperatorPhoneNumberQuery?.isFees,
        PlanID: newSchools[index].PlanID || 0,
        isBan: newSchools[index].isBan,
        SchoolLatitude: result.school_master.Latitude,
        SchoolLongitude: result.school_master.Longitude,
        AdsImgURL: busOperatorPhoneNumberQuery?.bus_operator_adsimage?.AdsImgURL,
        CTAType: busOperatorPhoneNumberQuery?.bus_operator_adsimage?.CTAType,
        BusOperatorPlanID: "",
        gpsTracking: gpsTracking,
        PrimaryStreamingMethod: primaryStreaming?.primary_streaming_method || "attendant_app",
      };

      finalResponse.push(schoolData);
    };

    // if (sNo !== "") {
    //   const d = await DB_MODELS.MOBILE_SESSIONS.update(
    //     {
    //       app_version: app_version,
    //       os_type: oSType,
    //       loginnumber: mobileNumber,
    //       lastactivity: moment().format("YYYY-MM-DD HH:mm:ss"),
    //     },
    //     {
    //       where: {
    //         sessionid: sNo,
    //       },
    //     }
    //   );
    // }
    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { isPushToken: isPushToken, schools: finalResponse });
  } catch (error) {

    await logError(req, res, "parentController", "syncData", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const fetchConfig = async (req, res) => {
  const { studentID, busOperatorID, schoolID } = req.query;

  try {
    const busOperator = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
      where: { BusOperatorID: busOperatorID },
    });

    if (!busOperator) {
      throw new Error('Bus operator not found.');
    }

    const { BusinessType: businessType } = busOperator;
    let configurations;

    if (businessType === 'B2B') {

      const redisKey = `fetchConfig_bus_oid_${busOperatorID}`;
      const cachedData = await redisService.getRedisValue(redisKey);

      if (cachedData) {
        try {
          configurations = JSON.parse(cachedData);
        } catch (error) {
          configurations = [];
        }
      }
      else {
        // Fetch configurations
        configurations = await DB_MODELS.CONFIGURATION_SMS_LONGCODE_CALL.findOne({
          where: { BusOperatorID: busOperatorID },
          attributes: [
            'isPhone',
            'isETA',
            'AllowSignup',
            'AllowParentsToCall',
            'AllowParentsToWhatsAppCall',
            'AllowParentsToSendSMS',
            'AllowVideoRecording',
            'isStoppageUpdatable',
            'isLongcode',
            'Longcode',
            'isGoogleAds',
            'GoogleAdsAPIKey',
            'OfflineLatlongSMSFrequency',
            'isSMS',
            'isNotification',
            'MessageProviderURL1',
            'MessageProviderURL2',
            'isTypeDistanceMessage',
            'isTypeDistanceMobileNofication',
            'isTypeDistanceMessagePrePrimary',
            'isTypeDistanceMessagePrimary',
            'isTypeDistanceMessageSecondary',
            'isTypeSMS2',
            'isTypeSMS3',
            'isTypeIndividualSMS',
            'isTypeGroupSMS',
            'isTypePortalSMS',
            'isLateStartSMSToBusOperator',
            'isPickup1SMS',
            'isPickup2SMS',
            'isDrop1SMS',
            'isDrop2SMS',
            'SMSServiceDisableMessage',
            'IndividualSMS1',
            'IndividualSMS2',
            'IndividualSMS3',
            'IndividualSMS4',
            'IndividualSMS5',
            'GroupSMS1',
            'GroupSMS2',
            'GPSInterval',
            'GPSIntervalForParent',
            'isPickup1MobileNofication',
            'isPickup2MobileNofication',
            'isDrop1MobileNofication',
            'isDrop2MobileNofication',
          ]
        });
        if (configurations) {
          await redisService.setRedisValue(redisKey, JSON.stringify(configurations.dataValues), 1800);
        }
      }
      configurations.PlanID = "0";
      configurations.planName = businessType;
      configurations.PlanType = businessType;
    }
    // For B2C and B2C-Retail
    else {
      let planId;

      // Fetch PlanID
      const studentPlan = await DB_MODELS.STUDENT_MASTER.findOne({
        where: {
          SchoolID: schoolID,
          StudentID: studentID,
          BusOperatorID: busOperatorID,
        },
        attributes: ['PlanID'],
        raw: true,
        // logging: console.log
      });

      if (studentPlan) {
        planId = studentPlan.PlanID
      }
      else {
        planId = businessType === 'B2C-Retail' ? 0 : 1
      }


      // Fetch Configurations
      configurations = await DB_MODELS.B2C_Plan_Master_Configurations.findOne({
        where: { PlanID: planId },
        include: [
          {
            model: DB_MODELS.B2C_CONFIGURATION,
            // as: 'b2c_configuration',
            required: true,
            attributes: [],
            where: { BusOperatorID: busOperatorID },
          },
        ],
        attributes: [
          'PlanID',
          'PlanDisplay',
          [Sequelize.col('b2c_configuration.isB2CPayment'), 'isB2CPayment'],
          'isPhone',
          'isWhatsApp',
          'isETA',
          'AllowSignup',
          'AllowParentsToCall',
          'AllowParentsToSendSMS',
          'AllowParentsToWhatsAppCall',
          'AllowVideoRecording',
          'isStoppageUpdatable',
          'isLongcode',
          'Longcode',
          'isGoogleAds',
          'GoogleAdsAPIKey',
          'OfflineLatlongSMSFrequency',
          'isSMS',
          'isNotification',
          'MessageProviderURL1',
          'MessageProviderURL2',
          'isTypeDistanceMessage',
          'isTypeDistanceMobileNofication',
          'isTypeDistanceMessagePrePrimary',
          'isTypeDistanceMessagePrimary',
          'isTypeDistanceMessageSecondary',
          'isTypeSMS2',
          'isTypeSMS3',
          'isTypeIndividualSMS',
          'isTypeGroupSMS',
          'isTypePortalSMS',
          'isLateStartSMSToBusOperator',
          'isPickup1SMS',
          'isPickup2SMS',
          'isDrop1SMS',
          'isDrop2SMS',
          'SMSServiceDisableMessage',
          'IndividualSMS1',
          'IndividualSMS2',
          'IndividualSMS3',
          'IndividualSMS4',
          'IndividualSMS5',
          'GroupSMS1',
          'GroupSMS2',
          'GPSInterval',
          'GPSIntervalForParent',
          'isPickup1MobileNofication',
          'isPickup2MobileNofication',
          'isDrop1MobileNofication',
          'isDrop2MobileNofication',
        ]
      });
      configurations.dataValues.PlanType = businessType;
    }
    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { configurations });
  }
  catch (error) {
    await logError(req, res, "parentController", "fetchConfig", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const mapScreen = async (req, res) => {
  try {
    const { busOperatorID, type, routeID, date, studentID } = req.query;

    if (!busOperatorID || !type || !routeID || !date || !studentID) {
      return apiHelper.failure(res, COMMON_MESSAGES.MISSING_PARAMETERS, {});
    }

    const dayName = moment(date).format('dddd');
    let queryKey, stayBackKey;

    if (type === 'Pickup') {
      queryKey = `Pickup${dayName}`;
    } else if (type === 'Drop') {
      queryKey = `Drop${dayName}`;
      stayBackKey = `StayBackDrop${dayName}`;
    }

    const studentRecord = await DB_MODELS.STUDENT_MASTER.findOne({
      attributes: [queryKey, ...(stayBackKey ? [stayBackKey] : [])],
      where: { StudentID: studentID }
    });

    if (!studentRecord) {
      return apiHelper.failure(res, COMMON_MESSAGES.DATA_NOT_FOUND, {});
    }

    const today = studentRecord[queryKey];
    const stayBackToday = stayBackKey ? studentRecord[stayBackKey] : 'N';

    if (today === 'Y' || stayBackToday === 'Y') {
      const busOperator = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
        attributes: ['TimeZone'],
        where: { BusOperatorID: busOperatorID }
      });

      if (!busOperator) {
        return apiHelper.success(res, COMMON_MESSAGES.DATA_NOT_FOUND, {}, {}, false, NOT_FOUND);
      }

      const transactions = await DB_MODELS.DRIVER_ROUTE_TRANSACTION_REFERENCE.findAll({
        attributes: ['DriverRouteTransactionID'],
        where: {
          BusOperatorID: busOperatorID,
          Type: type,
          RouteID: routeID,
          DateTime: {
            [Sequelize.Op.between]: [
              moment(date).startOf('day').toDate(),
              moment(date).endOf('day').toDate()
            ]
          },
          isLogout: 'N'
        },
        order: [['DateTime', 'DESC']]
      });

      if (transactions.length > 0) {
        const transactionIds = transactions.map(t => t.DriverRouteTransactionID);
        const lastPosition = await DB_MODELS.LOG_TRACK.findOne({
          attributes: ["DriverRouteTransactionID", "DateTime", "Latitude", "Longitude", "Address", "isOffline"],
          where: {
            DriverRouteTransactionID: { [Sequelize.Op.in]: transactionIds },
            DateTime: {
              [Sequelize.Op.between]: [
                moment(date).startOf('day').toDate(),
                moment(date).endOf('day').toDate()
              ]
            },
          },
          order: [['DateTime', 'DESC']],
          limit: 1,
        });

        if (lastPosition) {
          const driver = await DB_MODELS.DRIVER_ROUTE_TRANSACTION_REFERENCE.findOne({
            attributes: ['DriverID'],
            where: { DriverRouteTransactionID: lastPosition.DriverRouteTransactionID }
          });

          const busIncharge = await DB_MODELS.BUS_INCHARGE_MASTER.findOne({
            attributes: ['MobileNumber'],
            where: { DriverID: driver.DriverID }
          });

          const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
          const positionTime = lastPosition.DateTime;
          const timeDifference = moment(currentDateTime).diff(moment(positionTime), 'minutes');
          if (timeDifference > 5) {
            return apiHelper.success(res, COMMON_MESSAGES.UNABLE_TO_LOCATE_BUS, "");
          }

          const notificationMessage = lastPosition.isOffline === 'N' ? '' : 'There is lag in showing current location of bus.';

          const stoppagesQuery =
            type === 'Pickup'
              ? { FromRouteID: routeID }
              : { ToRouteID: routeID };

          const stoppages = await DB_MODELS.STUDENT_MASTER.findAll({
            attributes: [[type === 'Pickup' ? 'FromStoppageID' : 'ToStoppageID', 'StoppageID']],
            where: {
              BusOperatorID: busOperatorID,
              ...stoppagesQuery,
              isDeleted: 'N',
              isBan: 'N'
            },
            group: 'StoppageID'
          });

          const stoppageData = await Promise.all(
            stoppages.map(async s => {
              const stoppage = await DB_MODELS.STOPPAGE_MASTER.findOne({
                attributes: ['StopageName', 'Latitude', 'Longitude'],
                where: { StoppageID: s.dataValues.StoppageID }
              });
              return stoppage;
            })
          );

          return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, {
            isLogout: 'N',
            driverRouteTransactionID: lastPosition.DriverRouteTransactionID,
            position: {
              BusInchargeMobileNumber: busIncharge.MobileNumber,
              DateTime: currentDateTime,
              Latitude: lastPosition.Latitude,
              Longitude: lastPosition.Longitude,
              Address: lastPosition.Address,
              isOffline: lastPosition.isOffline,
              notificationMessage
            },
            stoppages: stoppageData
          });
        } else {
          return apiHelper.success(res, COMMON_MESSAGES.UNABLE_TO_LOCATE_BUS, "");
        }
      } else {
        return apiHelper.success(res, COMMON_MESSAGES.ALL_TRANSACTIONS_LOGGED_OUT, "");
      }
    } else {
      return apiHelper.success(res, COMMON_MESSAGES.TRIP_NOT_SCHEDULED, "");
    }


  } catch (error) {
    await logError(req, res, "parentController", "mapScreen", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const checkOnGoingTrip = async (req, res) => {
  const { busOperatorID, type, routeID, studentID, date, appVersion, osType } = req.query;
  const redisKey = `boid_${busOperatorID}_rid_${routeID}_type_${type}_id`;

  try {
    // Check Redis for ongoing trip
    let checkOngoing = await redisService.getRedisValue(redisKey)
    if (checkOngoing) {
      const tid = checkOngoing;
      return apiHelper.success(res, "", {
        activeTrip: true,
        tid,
        isRedisResponse: true,
      });
    }

    // Query driver route transactions
    const transactionResults = await DB_MODELS.DRIVER_ROUTE_TRANSACTION_REFERENCE.findAll({
      attributes: ["DriverRouteTransactionID"],
      where: {
        BusOperatorID: busOperatorID,
        Type: type,
        RouteID: routeID,
        isLogout: "N",
        DateTime: Sequelize.where(
          Sequelize.fn("DATE", Sequelize.col("DateTime")),
          date
        ),
      },
      order: [["DateTime", "DESC"]],
    });

    if (transactionResults.length > 0) {
      const transactionIDs = transactionResults.map(row => row.DriverRouteTransactionID);

      // Check for last recorded position
      const lastPositionResult = await DB_MODELS.LOG_TRACK.findOne({
        attributes: [
          "DriverRouteTransactionID",
          "DateTime",
          "Latitude",
          "Longitude",
          "Address",
          "isOffline",
        ],
        where: {
          DriverRouteTransactionID: {
            [Sequelize.Op.in]: transactionIDs,  // This is equivalent to the SQL "IN" clause
          },
          DateTime: Sequelize.where(
            Sequelize.fn("DATE", Sequelize.col("DateTime")),
            date
          ),
        },
        order: [["DateTime", "DESC"]],
      });

      if (lastPositionResult) {
        const currentDateTime = new Date();
        const recordedDateTime = new Date(lastPositionResult.DateTime);
        const timeDifference = Math.abs(currentDateTime - recordedDateTime) / 60000;

        if (timeDifference < 3) {
          return apiHelper.success(res, "", {
            activeTrip: true,
            tid: lastPositionResult.DriverRouteTransactionID,
            timeDifference: timeDifference.toFixed(2)
          }, { status: 529 });
        }
        else {
          return apiHelper.success(res, COMMON_MESSAGES.LOCATE_SCHOOL_BUS, {
            activeTrip: false,
            timeDifference: timeDifference.toFixed(2)
          }, { status: 528 }, false, NOT_FOUND);
        }
      }
    }
    return apiHelper.success(res, COMMON_MESSAGES.LOCATE_SCHOOL_BUS, {
      activeTrip: false,
    }, { status: 527 }, false, NOT_FOUND);
  }
  catch (error) {
    await logError(req, res, "parentController", "checkOnGoingTrip", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const getEvents = async (req, res) => {
  const { mobileNumber } = req.query;

  try {
    // Fetch Education News - Google RSS
    const response = await axios.get('https://news.google.com/rss/search?cf=all&pz=1&q=education%20news&hl=en-IN&gl=IN&ceid=IN:en');
    const result = await parseStringPromise(response.data);

    const feeds = [];
    const items = result.rss.channel[0].item.slice(0, 10);

    items.forEach((item, i) => {
      const description = item.description[0];
      const match = description.match(/src="([^"]+)"/);
      const parts = description.split('<font size="-1">');

      feeds.push({
        title: item.title[0],
        link: item.link[0],
        image: match ? match[1] : "",
        bannerimage: "",
        extras: "",
        siteTitle: parts[1] ? parts[1].replace(/<\/?[^>]+(>|$)/g, "") : "",
        description: parts[2]
          ? parts[2].replace(/<\/?[^>]+(>|$)/g, "")
          : parts[1]
            ? parts[1].replace(/<\/?[^>]+(>|$)/g, "")
            : "",
        action: "weblink"
      });
    });

    const output = { events: [] };

    const eventEng = {
      eventOrdering: 1,
      eventTopic: "Education News",
      eventType: "list",
      eventUrl: "https://news.google.com/rss/search?cf=all&pz=1&q=education%20news&hl=en-IN&gl=IN&ceid=IN:en",
      eventData: feeds
    };

    output.events.push(eventEng);
    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, output);
  }
  catch (error) {
    await logError(req, res, "parentController", "GetEvents", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.ERROR_FETCHING, error.message);
  }
};

const noSchoolFound = async (req, res) => {
  try {
    // const {
    //   sno,
    //   sname,
    //   saddress,
    //   sphone,
    //   scountry,
    //   scity,
    //   rname,
    //   rphone,
    //   sbusOperatorName,
    //   sbusOperatorPhone,
    // } = req.body;

    // Email configuration

    try {
      // Send email
      // PREPARING EMAIL VARIABLES
      const templatePATH = "noShoolFound.hbs";
      const templateParams = req.body

      await sendEmail({
        res,
        toUsersArray: "support@chakraview.co.in",
        templatePATH,
        templateParams,
        subject: 'Request for Adding/Onboarding School'
      });

    } catch (error) {
      return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);

      // await logError(req, res, "parentController", "noSchoolFound", error, {});
    }
    return apiHelper.success(res, COMMON_MESSAGES.EMAIL_SEND_SUCC, {});
  }
  catch (error) {
    await logError(req, res, "parentController", "noSchoolFound", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const checkOperatorAvailableOrNot = async (req, res) => {
  try {
    const { checkFor, busOperatorID } = req.query;

    if (!checkFor || !busOperatorID) {
      return apiHelper.success(res, AUTH_MESSAGES.INVALID_REQUEST, {}, {}, false, FORBIDDEN);
    }

    if (checkFor === 'AllowSignUp') {
      const result = await DB_MODELS.CONFIGURATION_SMS_LONGCODE_CALL.findOne({
        attributes: ['AllowSignup'],
        where: {
          BusOperatorID: busOperatorID
        }
      });

      if (result) {
        const { AllowSignup } = result;
        if (AllowSignup !== "Y") {
          return apiHelper.success(res, COMMON_MESSAGES.FACILITY_NOT_AVILABLE, {}, {}, false, FORBIDDEN);
        }
        return apiHelper.success(res, COMMON_MESSAGES.FACILITY_AVILABLE, {});
      }
      else {
        return apiHelper.success(res, COMMON_MESSAGES.NO_CONFIGURATION, {}, {}, false, NOT_FOUND);
      }
    }
    else {
      return apiHelper.success(res, AUTH_MESSAGES.INVALID_REQUEST, {}, {}, false, FORBIDDEN);
    }

  } catch (error) {
    await logError(
      req,
      res,
      "parentController",
      "checkOperatorAvailableOrNot",
      error,
      {}
    );
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const insertStoppage = async (req, res) => {

  const {
    InsertStoppageApp,
    busOperatorID,
    stopageName,
    location,
    countryID,
    address1,
    address2 = "-",
    cityID,
    pincode,
    latitude,
    longitude,
    createdBy,
    createdOn,
  } = req.body;

  try {
    // Sanitize and escape inputs
    const sanitizedStopageName = stopageName.replace(/'/g, "\\'");
    const sanitizedAddress1 = address1.replace(/'/g, "\\'");
    const sanitizedAddress2 = address2.replace(/'/g, "\\'");

    // Check if the stoppage name already exists
    const existingStoppage = await DB_MODELS.STOPPAGE_MASTER.findOne({
      where: {
        busOperatorID,
        StopageName: sanitizedStopageName,
        isDeleted: "N",
      },
    });

    if (existingStoppage) {
      return apiHelper.failure(res, COMMON_MESSAGES.STOPPAGE_EXISTS, "", FORBIDDEN);
    }

    // Get the SchoolID for the BusOperatorID
    const schoolData = await DB_MODELS.SCHOOL_MASTER.findOne({
      attributes: ["SchoolID"],
      where: {
        busOperatorID,
        isDeleted: "N",
      },
    });

    const School_ID = schoolData ? schoolData.SchoolID : null;

    if (!School_ID) {
      return apiHelper.success(res, COMMON_MESSAGES.SCHOOL_NOT_FOUND, {});
    }

    // Insert the new stoppage
    const newStoppage = await DB_MODELS.STOPPAGE_MASTER.create({
      SchoolID: School_ID,
      BusOperatorID: busOperatorID,
      StopageName: sanitizedStopageName,
      // Location: location,
      CountryID: countryID,
      Address1: sanitizedAddress1,
      Address2: sanitizedAddress2,
      CityID: cityID,
      Pincode: pincode,
      Latitude: latitude,
      Longitude: longitude,
      isDeleted: "N",
      CreatedBy: createdBy,
      CreatedOn: createdOn,
    });

    if (newStoppage) {
      return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED, {});
    } else {
      return apiHelper.success(res, COMMON_MESSAGES.ERROR_INSERTING, {});
    }
  } catch (error) {
    await logError(req, res, "parentController", "insertStoppage", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const getFile = async (req, res) => {
  const { fileName, app, sessionNo } = req.query
  try {
    const filesDir = 'files/';
    const redisKey = `${fileName}_nodeapp`;

    let data = "";
    const cachedData = await redisService.getRedisValue(redisKey);

    if (cachedData) {
      data = cachedData;
    }
    else {
      const filePath = path.join(filesDir, fileName);
      if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath, 'utf-8');
        await redisService.setRedisValue(redisKey, data, 7200);
      }
    }

    let jsonData = JSON.parse(data);
    jsonData.subscriptionActionLink = `${jsonData.subscriptionActionLink}`;

    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, jsonData);
  }
  catch (error) {
    await logError(req, res, "parentController", "getFile", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const getStudentDetails = async (req, res) => {
  const { dataForStudentID } = req.query;
  try {
    if (dataForStudentID) {
      const studentData = await DB_MODELS.STUDENT_MASTER.findOne({
        where: { StudentID: dataForStudentID },
        attributes: [
          'BusOperatorID', 'FatherName', 'MotherName', 'SchoolID', 'SchoolSection', 'StudentName',
          'StudentNameHindi', 'StudentStandard', 'StudentClass', 'StudentBldGrp', 'CountryID',
          'Address1', 'Address2', 'CityID', 'Pincode', 'FatherMobileNumber', 'MotherMobileNumber',
          'OtherMobileNumber', 'PrimaryMobileNumberOf', 'EmailID', 'FromRouteID', 'isGPS', 'ToRouteID',
          'FromStoppageID', 'ToStoppageID', 'ChakraviewCode', 'SchoolCode', 'PickupMonday', 'PickupTuesday',
          'PickupWednesday', 'PickupThursday', 'PickupFriday', 'PickupSaturday', 'PickupSunday', 'DropMonday',
          'DropTuesday', 'DropWednesday', 'DropThursday', 'DropFriday', 'DropSaturday', 'DropSunday',
          'StayBackToRouteID', 'StayBackDropMonday', 'StayBackDropTuesday', 'StayBackDropWednesday',
          'StayBackDropThursday', 'StayBackDropFriday', 'StayBackDropSaturday', 'StayBackDropSunday', 'isAttendance'
        ]
      });

      if (!studentData) {
        return apiHelper.success(res, "Student not found.", {}, {}, false, NOT_FOUND);
      }

      const fromRoutes = await DB_MODELS.PICKUP_ROUTE_MASTER.findAll({
        include: [{
          model: DB_MODELS.SCHOOL_MASTER,
          where: {
            BusOperatorID: studentData.BusOperatorID,
            SchoolID: studentData.SchoolID,
            isDeleted: 'N'
          },
          attributes: []
        }],
        where: { isDeleted: 'N' },
        order: [['RouteName', 'ASC']],
        attributes: ['PickupRouteID', 'RouteName']
      });

      const toRoutes = await DB_MODELS.DROP_ROUTE_MASTER.findAll({
        include: [{
          model: DB_MODELS.SCHOOL_MASTER,
          where: {
            BusOperatorID: studentData.BusOperatorID,
            SchoolID: studentData.SchoolID,
            isDeleted: 'N'
          },
          attributes: []
        }],
        where: { isDeleted: 'N' },
        order: [['RouteName', 'ASC']],
        attributes: ['DropRouteID', 'RouteName']
      });

      const stoppages = await DB_MODELS.STOPPAGE_MASTER.findAll({
        where: { BusOperatorID: studentData.BusOperatorID, isDeleted: 'N' },
        order: [['StopageName', 'ASC']],
        attributes: ['StoppageID', 'StopageName']
      });

      const countries = await DB_MODELS.COUNTRY_MASTER.findAll({
        order: [['CountryName', 'ASC']],
        attributes: ['CountryID', 'CountryName']
      });

      const cities = await DB_MODELS.CITY_MASTER.findAll({
        where: { CountryID: studentData.CountryID },
        order: [['CityName', 'ASC']],
        attributes: ['CityID', 'CityName']
      });

      const operators = await DB_MODELS.BUS_OPERATOR_MASTER.findAll({
        where: { isActive: 'Y', isDeleted: 'N' },
        attributes: ['BusOperatorID', 'BusOperatorName']
      });

      const schools = await DB_MODELS.SCHOOL_MASTER.findAll({
        where: { BusOperatorID: studentData.BusOperatorID, isDeleted: 'N' },
        order: [['SchoolName', 'ASC']],
        attributes: ['SchoolID', 'SchoolName']
      });

      const final_response = {
        ...studentData.toJSON(),
        FromRoutes: fromRoutes,
        ToRoutes: toRoutes,
        Stoppages: stoppages,
        Countries: countries,
        Cities: cities,
        Operators: operators,
        Schools: schools
      };
      return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, final_response);
    }
    else {
      return apiHelper.failure(res, AUTH_MESSAGES.INVALID_REQUEST, "", FORBIDDEN);
    }
  }
  catch (error) {
    await logError(req, res, "parentController", "getStudentDetails", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const editStudent = async (req, res) => {
  try {

    const {
      studentID,
      fatherName,
      motherName,
      schoolID,
      schoolSection,
      studentName,
      studentNameHindi = "",
      studentStandard,
      studentClass,
      studentBloodGroup,
      countryID,
      address1,
      address2,
      cityID,
      pincode,
      fatherMobileNumber,
      motherMobileNumber,
      otherMobileNumber,
      primaryMobileNumberOf,
      emailID,
      fromRouteID,
      toRouteID,
      fromStoppageID,
      toStoppageID,
      pickupMonday,
      pickupTuesday,
      pickupWednesday,
      pickupThursday,
      pickupFriday,
      pickupSaturday,
      pickupSunday,
      dropMonday,
      dropTuesday,
      dropWednesday,
      dropThursday,
      dropFriday,
      dropSaturday,
      dropSunday,
      stayBackToRouteID,
      stayBackDropMonday,
      stayBackDropTuesday,
      stayBackDropWednesday,
      stayBackDropThursday,
      stayBackDropFriday,
      stayBackDropSaturday,
      stayBackDropSunday,
      isAttendance,
      updatedBy,
      updatedOn,
      chakraviewCode,
    } = req.body;

    // Determine primary mobile number
    let primaryMobileNumber = "";
    if (primaryMobileNumberOf === "Father") {
      primaryMobileNumber = fatherMobileNumber;
    } else if (primaryMobileNumberOf === "Mother") {
      primaryMobileNumber = motherMobileNumber;
    } else if (primaryMobileNumberOf === "Other") {
      primaryMobileNumber = otherMobileNumber;
    }

    // Construct the update payload
    const updatePayload = {
      FatherName: fatherName,
      MotherName: motherName,
      SchoolID: schoolID,
      SchoolSection: schoolSection,
      StudentName: studentName,
      StudentNameHindi: studentNameHindi,
      StudentStandard: studentStandard,
      StudentClass: studentClass,
      StudentBldGrp: studentBloodGroup,
      CountryID: countryID,
      Address1: address1,
      Address2: address2,
      CityID: cityID,
      Pincode: pincode,
      FatherMobileNumber: fatherMobileNumber,
      MotherMobileNumber: motherMobileNumber,
      OtherMobileNumber: otherMobileNumber,
      PrimaryMobileNumber: primaryMobileNumber,
      PrimaryMobileNumberOf: primaryMobileNumberOf,
      EmailID: emailID,
      FromRouteID: fromRouteID,
      ToRouteID: toRouteID,
      FromStoppageID: fromStoppageID,
      ToStoppageID: toStoppageID,
      PickupMonday: pickupMonday,
      PickupTuesday: pickupTuesday,
      PickupWednesday: pickupWednesday,
      PickupThursday: pickupThursday,
      PickupFriday: pickupFriday,
      PickupSaturday: pickupSaturday,
      PickupSunday: pickupSunday,
      DropMonday: dropMonday,
      DropTuesday: dropTuesday,
      DropWednesday: dropWednesday,
      DropThursday: dropThursday,
      DropFriday: dropFriday,
      DropSaturday: dropSaturday,
      DropSunday: dropSunday,
      StayBackToRouteID: stayBackToRouteID,
      StayBackDropMonday: stayBackDropMonday,
      StayBackDropTuesday: stayBackDropTuesday,
      StayBackDropWednesday: stayBackDropWednesday,
      StayBackDropThursday: stayBackDropThursday,
      StayBackDropFriday: stayBackDropFriday,
      StayBackDropSaturday: stayBackDropSaturday,
      StayBackDropSunday: stayBackDropSunday,
      isAttendance,
      UpdatedBy: updatedBy,
      UpdatedOn: updatedOn,
      ChakraviewCode: chakraviewCode,
    };

    if (pickupMonday) {
      updatePayload.PickupMonday = pickupMonday;
      updatePayload.PickupTuesday = pickupTuesday;
      updatePayload.PickupWednesday = pickupWednesday;
      updatePayload.PickupThursday = pickupThursday;
      updatePayload.PickupFriday = pickupFriday;
      updatePayload.PickupSaturday = pickupSaturday;
      updatePayload.PickupSunday = pickupSunday;
      updatePayload.DropMonday = dropMonday;
      updatePayload.DropTuesday = dropTuesday;
      updatePayload.DropWednesday = dropWednesday;
      updatePayload.DropThursday = dropThursday;
      updatePayload.DropFriday = dropFriday;
      updatePayload.DropSaturday = dropSaturday;
      updatePayload.DropSunday = dropSunday;
      updatePayload.StayBackToRouteID = stayBackToRouteID;
      updatePayload.StayBackDropMonday = stayBackDropMonday;
      updatePayload.StayBackDropTuesday = stayBackDropTuesday;
      updatePayload.StayBackDropWednesday = stayBackDropWednesday;
      updatePayload.StayBackDropThursday = stayBackDropThursday;
      updatePayload.StayBackDropFriday = stayBackDropFriday;
      updatePayload.StayBackDropSaturday = stayBackDropSaturday;
      updatePayload.StayBackDropSunday = stayBackDropSunday;
      updatePayload.isAttendance = isAttendance;
    }

    const result = await DB_MODELS.STUDENT_MASTER.update(updatePayload, {
      where: { StudentID: studentID },
    });

    if (result[0] === 0) {
      return apiHelper.success(res, "Student not found or no changes made", {}, {}, false);
    }

    return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED, {}, {});
  }
  catch (error) {
    await logError(req, res, "parentController", "editStudent", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const getCountries = async (req, res) => {
  try {
    const { retrieve } = req.query;
    let countries = [];

    if (retrieve === 'Country') {
      countries = await DB_MODELS.COUNTRY_MASTER.findAll({
        attributes: ['CountryID', 'CountryName'],
        order: [['CountryName', 'ASC']]
      });
    }
    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, countries);
  }
  catch (error) {
    await logError(req, res, "parentController", "getCountries", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const getCity = async (req, res) => {
  try {
    const { retrieve, countryID } = req.query;

    if (retrieve !== 'CityForSignUpFirst') {
      return apiHelper.failure(res, AUTH_MESSAGES.INVALID_REQUEST, "", BAD_REQUEST);
    }

    const cities = await DB_MODELS.CITY_MASTER.findAll({
      attributes: ["CityID", "CityName"],
      where: {
        "CountryID": countryID,
      },
      include: [
        {
          model: DB_MODELS.BUS_OPERATOR_MASTER,
          where: {
            isDeleted: "N",
            isActive: "Y",
          },
          required: true,
        },
      ],
      order: [["CityName", "ASC"]],
    });

    let citiesData = [];
    if (cities.length > 0) {
      citiesData = cities.map((city) => ({
        CityID: city.CityID,
        CityName: city.CityName,
      }));
    }
    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, citiesData);

  } catch (error) {
    await logError(req, res, "parentController", "getCity", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const getSchoolByCountry = async (req, res) => {
  try {
    const { retrieve, cityName, } = req.query;

    let operators = [];
    if (retrieve === 'BusOperator') {
      const selCityQuery = await DB_MODELS.CITY_MASTER.findAll({
        attributes: ["CityID"],
        where: {
          CityName: cityName
        },
      })


      if (selCityQuery.length > 0) {
        const CityID = selCityQuery[0].CityID;
        operators = await DB_MODELS.BUS_OPERATOR_MASTER.findAll({
          where: {
            isDeleted: 'N',
            isActive: 'Y',
            CityID: CityID
          },
          include: [{
            model: DB_MODELS.CONFIGURATION_SMS_LONGCODE_CALL,
            where: { AllowSignup: 'Y' },
            attributes: [],
            required: true
          }],
          attributes: ['BusOperatorID', 'BusOperatorName'],
          order: [['BusOperatorName', 'ASC']]
        });
      }
    }
    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, operators);
  } catch (error) {
    await logError(req, res, "parentController", "getSchoolByCountry", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const inAppNotification = async (req, res) => {
  try {

    const { mobileNumber } = req.query;

    const MessageTitle = "Distance Message";
    const MessageAttendanceTitle = "Attendance Message";
    const MessageAttendanceSms23Title = "Student Attendance Message";

    const distanceLogs = await DB_MODELS.DISTANCE_MESSAGE_LOG.findAll({
      where: {
        mobileNumber: {
          [Sequelize.Op.like]: `%${mobileNumber}%`
        }
      },
      order: [['dateTime', 'DESC']],
      limit: 10
    });

    let json1 = [];
    if (distanceLogs.length > 0) {
      distanceLogs.forEach(log => {
        json1.push({
          mobileNumber: mobileNumber,
          title: MessageTitle,
          dateTime: log.DateTime,
          message: log.MessageURL
        });
      });
    } else {
      json1 = [{ message: "There is no data available" }];
    }

    // Query portal_message_log table
    const portalLogs = await DB_MODELS.PORTAL_MESSAGE_LOG.findAll({
      where: {
        mobileNumbers: {
          [Sequelize.Op.like]: `%91${mobileNumber}%`
        }
      },
      order: [['dateTime', 'DESC']],
      limit: 5
    });

    let json2 = [];
    if (portalLogs.length > 0) {
      portalLogs.forEach(log => {
        json2.push({
          mobileNumber: mobileNumber,
          title: MessageTitle,
          dateTime: log.DateTime,
          message: log.Message
        });
      });
    } else {
      json2 = [{ message: "There is no data available" }];
    }

    // Query student_attendance_notification_log table
    const attendanceLogs = await DB_MODELS.STUDENT_ATTENDANCE_NOTI_LOG.findAll({
      include: [{
        model: DB_MODELS.STUDENT_MASTER,
        where: {
          primaryMobileNumber: {
            [Sequelize.Op.like]: `%${mobileNumber}%`
          }
        }
      }],
      order: [['dateTime', 'DESC']],
      limit: 5
    });

    let json3 = [];
    if (attendanceLogs.length > 0) {
      attendanceLogs.forEach(log => {
        json3.push({
          mobileNumber: mobileNumber,
          title: MessageAttendanceTitle,
          dateTime: log.DateTime,
          message: log.MessageURL
        });
      });
    } else {
      json3 = [{ message: "There is no data available" }];
    }

    // Query notification_log table for attendance related messages
    const attendanceSms23Logs = await DB_MODELS.NOTIFICATION_LOG_MODEL.findAll({
      include: [{
        model: DB_MODELS.STUDENT_MASTER,
        where: {
          PrimaryMobileNumber: {
            [Sequelize.Op.like]: `%${mobileNumber}%`
          }
        }
      }],
      order: [['dateTime', 'DESC']],
      limit: 5
    });

    let json4 = [];
    if (attendanceSms23Logs.length > 0) {
      attendanceSms23Logs.forEach(log => {
        json4.push({
          mobileNumber: mobileNumber,
          title: MessageAttendanceSms23Title,
          dateTime: log.DateTime,
          message: log.MessageURL
        });
      });
    } else {
      json4 = [{ message: "There is no data available" }];
    }

    let notificationData = [];

    // Combine logs based on conditions
    if (distanceLogs.length > 0 && portalLogs.length === 0 && attendanceLogs.length === 0 && attendanceSms23Logs.length === 0) {
      notificationData = json1;
    } else if (portalLogs.length > 0 && distanceLogs.length === 0 && attendanceLogs.length === 0 && attendanceSms23Logs.length === 0) {
      notificationData = json2;
    } else if (attendanceLogs.length > 0 && distanceLogs.length === 0 && portalLogs.length === 0 && attendanceSms23Logs.length === 0) {
      notificationData = json3;
    } else if (attendanceSms23Logs.length > 0 && distanceLogs.length === 0 && portalLogs.length === 0 && attendanceLogs.length === 0) {
      notificationData = json4;
    } else if (portalLogs.length > 0 && distanceLogs.length > 0 && attendanceLogs.length === 0 && attendanceSms23Logs.length === 0) {
      notificationData = [...json1, ...json2];
    } else if (portalLogs.length > 0 && attendanceLogs.length > 0 && distanceLogs.length === 0 && attendanceSms23Logs.length === 0) {
      notificationData = [...json2, ...json3];
    } else if (distanceLogs.length > 0 && attendanceLogs.length > 0 && portalLogs.length === 0 && attendanceSms23Logs.length === 0) {
      notificationData = [...json1, ...json3];
    } else if (attendanceSms23Logs.length > 0 && distanceLogs.length > 0 && portalLogs.length === 0 && attendanceLogs.length === 0) {
      notificationData = [...json1, ...json4];
    } else if (distanceLogs.length > 0 && portalLogs.length > 0 && attendanceLogs.length > 0 && attendanceSms23Logs.length === 0) {
      notificationData = [...json1, ...json2, ...json3];
    } else if (distanceLogs.length > 0 && portalLogs.length > 0 && attendanceSms23Logs.length > 0 && attendanceLogs.length === 0) {
      notificationData = [...json1, ...json2, ...json4];
    } else if (distanceLogs.length > 0 && attendanceLogs.length > 0 && portalLogs.length === 0 && attendanceSms23Logs.length > 0) {
      notificationData = [...json1, ...json3, ...json4];
    } else if (distanceLogs.length > 0 && portalLogs.length > 0 && attendanceLogs.length > 0 && attendanceSms23Logs.length > 0) {
      notificationData = [...json1, ...json2, ...json3, ...json4];
    }

    notificationData.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, notificationData);

  }
  catch (error) {
    await logError(
      req,
      res,
      "parentController",
      "inAppNotification",
      error,
      {}
    );
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const checkEta = async (req, res) => {
  try {
    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, {});
  } catch (error) {
    await logError(req, res, "parentController", "checkEta", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const deleteAccount = async (req, res) => {
  const { mobileNumber } = req.body;
  try {
    // Step 1: Check if the account exists
    const student = await DB_MODELS.STUDENT_MASTER.findOne({
      where: {
        [Op.or]: [
          { PrimaryMobileNumber: mobileNumber },
          { OtherMobileNumber: mobileNumber },
          { FatherMobileNumber: mobileNumber },
          { MotherMobileNumber: mobileNumber }
        ]
      }
    });

    if (student) {
      // Step 2: Delete (set `isDeleted` to 'Y') if account exists
      const updateResult = await DB_MODELS.STUDENT_MASTER.update(
        { isDeleted: 'Y' },
        {
          where: {
            [Op.or]: [
              { PrimaryMobileNumber: mobileNumber },
              { OtherMobileNumber: mobileNumber },
              { FatherMobileNumber: mobileNumber },
              { MotherMobileNumber: mobileNumber }
            ]
          }
        }
      );

      if (updateResult[0] > 0) {
        result = COMMON_MESSAGES.ACCOUNT_DELETED;
      }
      else {
        result = COMMON_MESSAGES.UNABLE_DELETE_ACCOUNT;
      }
    }
    else {
      result = COMMON_MESSAGES.ACCOUNT_NOT_EXIST;
    }
    return apiHelper.success(res, result, {});
  }
  catch (error) {
    await logError(req, res, "parentController", "deleteAccount", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }

  // try {
  //   return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, {});
  // } catch (error) {
  //   await logError(req, res, "parentController", "deleteAccount", error, {});
  //   return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  // }
};

const insertStudent = async (req, res) => {

  try {
    const {
      busOperatorID,
      fatherName,
      motherName,
      schoolID,
      schoolSection,
      studentName,
      studentNameHindi = '',
      studentStandard,
      studentClass,
      studentBloodGroup,
      countryID,
      address1,
      address2,
      cityID,
      pincode,
      fatherMobileNumber,
      motherMobileNumber,
      otherMobileNumber,
      primaryMobileNumberOf,
      emailID,
      fromRouteID,
      toRouteID,
      fromStoppageID,
      toStoppageID,
      chakraviewCode = '',
      schoolCode,
      pickupMonday,
      pickupTuesday,
      pickupWednesday,
      pickupThursday,
      pickupFriday,
      pickupSaturday,
      pickupSunday,
      dropMonday,
      dropTuesday,
      dropWednesday,
      dropThursday,
      dropFriday,
      dropSaturday,
      dropSunday,
      stayBackToRouteID,
      stayBackDropMonday,
      stayBackDropTuesday,
      stayBackDropWednesday,
      stayBackDropThursday,
      stayBackDropFriday,
      stayBackDropSaturday,
      stayBackDropSunday,
      isAttendance,
      createdBy,
      createdOn,
      isBan,
      flag
    } = req.body;
    const isDeleted = 'N';

    if (isBan === "Y") {
      return apiHelper.success(res, COMMON_MESSAGES.CONTACT_ACTIVATE_ACCOUNT, {}, {}, false, FORBIDDEN);
    };

    if (flag !== "insert") {
      return apiHelper.success(res, COMMON_MESSAGES.INVALID_FLAG_PROVIDED, {}, {}, true, NOT_FOUND);
    };

    const getPlanId = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
      where: { BusOperatorID: busOperatorID },
      attributes: ["BusinessType"]
    });

    let planID = "0";

    if (getPlanId.BusinessType == 'B2B') {
      planID = "0"
    } else if (getPlanId.BusinessType == 'B2C') {
      planID = "1"
    } else if (getPlanId.BusinessType == 'B2C-Retail') {
      planID = "0"
    };

    let primaryMobileNumber;
    if (primaryMobileNumberOf === 'Father') {
      primaryMobileNumber = fatherMobileNumber;
    } else if (primaryMobileNumberOf === 'Mother') {
      primaryMobileNumber = motherMobileNumber;
    } else if (primaryMobileNumberOf === 'Other') {
      primaryMobileNumber = otherMobileNumber;
    };

    let student;
    if (pickupMonday !== undefined) {
      student = await DB_MODELS.STUDENT_MASTER.create({
        PlanID: planID,
        BusOperatorID: busOperatorID,
        FatherName: fatherName,
        MotherName: motherName,
        SchoolID: schoolID,
        SchoolSection: schoolSection,
        StudentName: studentName,
        StudentNameHindi: studentNameHindi,
        StudentStandard: studentStandard,
        StudentClass: studentClass,
        StudentBloodGroup: studentBloodGroup,
        CountryID: countryID,
        Address1: address1,
        Address2: address2,
        CityID: cityID,
        Pincode: pincode,
        FatherMobileNumber: fatherMobileNumber,
        MotherMobileNumber: motherMobileNumber,
        OtherMobileNumber: otherMobileNumber,
        PrimaryMobileNumber: primaryMobileNumber,
        PrimaryMobileNumberOf: primaryMobileNumberOf,
        EmailID: emailID,
        isBan,
        FromRouteID: fromRouteID,
        ToRouteID: toRouteID,
        FromStoppageID: fromStoppageID,
        ToStoppageID: toStoppageID,
        ChakraviewCode: chakraviewCode,
        SchoolCode: schoolCode,
        PickupMonday: pickupMonday,
        PickupTuesday: pickupTuesday,
        PickupWednesday: pickupWednesday,
        PickupThursday: pickupThursday,
        PickupFriday: pickupFriday,
        PickupSaturday: pickupSaturday,
        PickupSunday: pickupSunday,
        DropMonday: dropMonday,
        DropTuesday: dropTuesday,
        DropWednesday: dropWednesday,
        DropThursday: dropThursday,
        DropFriday: dropFriday,
        DropSaturday: dropSaturday,
        DropSunday: dropSunday,
        StayBackToRouteID: stayBackToRouteID,
        StayBackDropMonday: stayBackDropMonday,
        StayBackDropTuesday: stayBackDropTuesday,
        StayBackDropWednesday: stayBackDropWednesday,
        StayBackDropThursday: stayBackDropThursday,
        StayBackDropFriday: stayBackDropFriday,
        StayBackDropSaturday: stayBackDropSaturday,
        StayBackDropSunday: stayBackDropSunday,
        isAttendance,
        isDeleted,
        CreatedBy: createdBy,
        CreatedOn: createdOn,
      });
    }
    else {
      student = await DB_MODELS.STUDENT_MASTER.create({
        PlanID: planID,
        BusOperatorID: busOperatorID,
        FatherName: fatherName,
        MotherName: motherName,
        SchoolID: schoolID,
        SchoolSection: schoolSection,
        StudentName: studentName,
        StudentNameHindi: studentNameHindi,
        StudentStandard: studentStandard,
        StudentClass: studentClass,
        StudentBloodGroup: studentBloodGroup,
        CountryID: countryID,
        Address1: address1,
        Address2: address2,
        CityID: cityID,
        Pincode: pincode,
        FatherMobileNumber: fatherMobileNumber,
        MotherMobileNumber: motherMobileNumber,
        OtherMobileNumber: otherMobileNumber,
        PrimaryMobileNumber: primaryMobileNumber,
        PrimaryMobileNumberOf: primaryMobileNumberOf,
        EmailID: emailID,
        isBan,
        FromRouteID: fromRouteID,
        ToRouteID: toRouteID,
        FromStoppageID: fromStoppageID,
        ToStoppageID: toStoppageID,
        ChakraviewCode: chakraviewCode,
        SchoolCode: schoolCode,
        isDeleted,
        CreatedBy: createdBy,
        CreatedOn: createdOn,
      });
    }

    if (!chakraviewCode) {
      await student.update({ ChakraviewCode: student.id });
    };

    // Note -- we don't know the purpose of below code, just carring over from legacy code.
    const distanceConfigs = await DB_MODELS.CONFIGURE_DISTANCE_SMS.findAll({
      where: {
        BusOperatorID: busOperatorID,
        SchoolID: schoolID,
      },
    });

    if (distanceConfigs.length > 0) {
      for (const config of distanceConfigs) {
        const existingStandards = config.StudentStandard
          ? config.StudentStandard.split(",")
          : [];
        if (!existingStandards.includes(studentStandard)) {
          existingStandards.push(studentStandard);
          await config.update({
            StudentStandard: existingStandards.join(","),
          });
        }
      }
    }
    else {
      await DB_MODELS.CONFIGURE_DISTANCE_SMS.create({
        BusOperatorID: busOperatorID,
        SchoolID: schoolID,
        RouteType: 'Pickup',
        StudentStandard: studentStandard,
        CreatedOn: createdOn,
      });
      await DB_MODELS.CONFIGURE_DISTANCE_SMS.create({
        BusOperatorID: busOperatorID,
        SchoolID: schoolID,
        RouteType: 'Drop',
        StudentStandard: studentStandard,
        CreatedOn: createdOn,
      });
    }
    return apiHelper.success(res, COMMON_MESSAGES.ACCOUNT_ACTIVATED, {}, {}, true, CREATED);

  }
  catch (error) {
    await logError(req, res, "parentController", "insertStudent", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const cityForSignUpFirst = async (req, res) => {
  try {
    const { retrieve, countryID } = req.query;
    let selRecentCityQuery
    if (retrieve == "CityForSignupFirst") {

      selRecentCityQuery = await DB_MODELS.CITY_MASTER.findAll({
        attributes: ["CityName", "CityId"],
        where: { CountryID: countryID },
        include: [
          {
            model: DB_MODELS.BUS_OPERATOR_MASTER,
            required: true,
            where: { isDeleted: 'N', isActive: 'Y' },
            attributes: []
          }],
        order: [['CityName']],
      })
    }
    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { cities: selRecentCityQuery });
  }
  catch (error) {
    await logError(req, res, "parentController", "cityForSignUpFirst", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};

const getSchoolsForDropdown = async (req, res) => {
  const { retrieve, busOperatorID } = req.query
  try {
    let selSchoolQuery
    if (retrieve == "SchoolForDropdown") {
      selSchoolQuery = await DB_MODELS.SCHOOL_MASTER.findAll({
        attributes: ["SchoolID", "SchoolName"],
        where: { busOperatorID: busOperatorID, isDeleted: 'N' },
        order: [['SchoolName']],
      })
    }
    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { schools: selSchoolQuery });
  }
  catch (error) {
    await logError(req, res, "parentController", "getSchoolsForDropdown", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
}

const getSchoolRoutesStoppages = async (req, res) => {
  const { retrieve, busOperatorID, schoolID } = req.query
  try {
    let selFromRouteQuery
    let selToRouteQuery
    let selStoppageQuery
    if (retrieve == "RouteStoppagesOfSchoolForDropdown") {

      selFromRouteQuery = await DB_MODELS.PICKUP_ROUTE_MASTER.findAll({
        attributes: ["PickupRouteID", "RouteName"],
        where: { isDeleted: 'N' },
        include: [
          {
            model: DB_MODELS.SCHOOL_MASTER,
            required: true,
            where: { busOperatorID: busOperatorID, schoolID: schoolID, isDeleted: 'N' },
            attributes: [],
          }],
        order: [['RouteName']],
      }),

        selToRouteQuery = await DB_MODELS.DROP_ROUTE_MASTER.findAll({
          where: { isDeleted: 'N' },
          attributes: ["DropRouteID", "RouteName"],
          include: [
            {
              model: DB_MODELS.SCHOOL_MASTER,
              required: true,
              where: { busOperatorID: busOperatorID, schoolID: schoolID, isDeleted: 'N' },
              attributes: [],
            }],
          order: [['RouteName']],
        })

      selStoppageQuery = await DB_MODELS.STOPPAGE_MASTER.findAll({
        attributes: ["StoppageID", "StopageName"],
        where: { busOperatorID: busOperatorID, isDeleted: 'N' },
        order: [['StopageName']],
      })

    }
    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { fromRoutes: selFromRouteQuery, toRoutes: selToRouteQuery, stoppages: selStoppageQuery });
  }
  catch (error) {
    await logError(req, res, "parentController", "getSchoolRoutesStoppages", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
}

const getStudentInfo = async (req, res) => {
  const { retrieve, mobileNumber } = req.query
  try {
    let selStudentQuery
    let updateStudentQuery = []
    if (retrieve == "Student") {
      selStudentQuery = await DB_MODELS.STUDENT_MASTER.findAll({
        attributes: ["StudentID", "StudentName",],
        where: {
          [Op.or]: [
            { FatherMobileNumber: mobileNumber },
            { MotherMobileNumber: mobileNumber },
            { OtherMobileNumber: mobileNumber }
          ],
          isDeleted: 'N', isBan: 'N'
        },
        include: [{
          model: DB_MODELS.SCHOOL_MASTER,
          required: true,
          attributes: ["SchoolName"],
        }],
      })
      updateStudentQuery = selStudentQuery.map((student) => ({
        StudentID: student.StudentID,
        StudentName: student.StudentName,
        SchoolName: student.school_master.SchoolName
      })
      )
    }
    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { students: updateStudentQuery });
  }
  catch (error) {
    await logError(req, res, "parentController", "getStudentInfo", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
}

const getCheckTripStartedOrNo = async (req, res) => {
  const { routeID, busOperatorID, date, type, studentID, sNo, } = req.query
  try {
    const selDriverRouteTransactionIDQuery = await DB_MODELS.DRIVER_ROUTE_TRANSACTION_REFERENCE.findOne({
      attributes: ["DriverRouteTransactionID", "isLogout"],
      where: {
        BusOperatorID: busOperatorID,
        Type: type,
        RouteID: routeID,
        DateTime: Sequelize.where(
          Sequelize.fn("DATE", Sequelize.col("DateTime")),
          date
        ),
      },
      order: [['DateTime', 'DESC']],
    });

    let finalMessage = '';
    let activeTrip = false;
    let status = "";

    if (selDriverRouteTransactionIDQuery) {
      const isLogout = selDriverRouteTransactionIDQuery.dataValues.isLogout
      if (isLogout == 'Y') {
        finalMessage = "Your Trip has ended. Contact Support for further assistance";
        status = "902"
      }
      else if (isLogout == 'N') {
        finalMessage = "Your Trip is currently LIVE. You can go to the dashboard and click on your childs name to check the Route.";
        status = "903"
        activeTrip = true;
      }
    }
    else {
      finalMessage = "Your Trip is yet to start. Contact Support for further assistance.";
      status = "901"
    }
    return apiHelper.success(res, finalMessage, { activeTrip, status });

  }
  catch (error) {
    await logError(req, res, "parentController", "getCheckTripStartedOrNo", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
}


const insertDateType = async (req, res) => {
  const { studentID, dateTime, fromDate, fromType, toDate, toType, } = req.body
  try {
    let data = fromDate
    let type = fromType
    await DB_MODELS.AbsentLogModel.create({
      StudentID: studentID,
      DateTime: dateTime,
      Date: data,
      Type: type
    })
    return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_CREATED);

  }
  catch (error) {
    await logError(req, res, "parentController", "insertDateType", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
}

const imageUpload = async (req, res) => {
  const { img, source_type, source_id } = req.body;
  try {
    if (source_type === "student_photo") {
      const base64WithoutHeader = img.replace(/^data:image\/\w+;base64,/, '');
      const mimeType = getMimeTypeFromBase64(base64WithoutHeader);
      const extension = getFileExtension(mimeType);

      if (mimeType === "unknown") {
        return apiHelper.success(res, "Unsupported image format", {}, {}, false);
      };

      const buffer = Buffer.from(base64WithoutHeader, 'base64');
      const timestamp = Date.now();
      const fileName = `student_photo_${timestamp}.${extension}`;

      const student = await DB_MODELS.STUDENT_MASTER.findOne({
        where: { StudentID: source_id },
        attributes: ['Student_Img']
      });

      const oldFileName = student?.Student_Img;

      const photos = await uploadFile(buffer, fileName, mimeType);
      await DB_MODELS.STUDENT_MASTER.update({ Student_Img: fileName }, { where: { StudentID: source_id } });

      if (oldFileName) {
        await deleteFile(oldFileName);
      };

      return apiHelper.success(res, "Student image updated successfully!", { img: photos }, {});
    };

  } catch (error) {
    await logError(req, res, "parentController", "imageUpload", error, {});
    return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
  }
};


async function getStudentRouteInfo(studentId, schoolId, isMessage, businessType) {
  // const { studentId, schoolId, isMessage } = req.query;

  try {

    // Fetch PlanID and BusOperatorID
    const student = await DB_MODELS.STUDENT_MASTER.findOne({
      where: { StudentID: studentId, SchoolID: schoolId },
      attributes: ['PlanID', 'BusOperatorID']
    });

    const { PlanID, BusOperatorID } = student.dataValues;

    let configurations;
    // if (PlanID === 0 && businessType === 'B2B') {
    if (PlanID === 0) {
      configurations = await DB_MODELS.CONFIGURATION_SMS_LONGCODE_CALL.findOne({
        where: { BusOperatorID },
        attributes: ['isPhone', 'isETA', 'GPSIntervalForParent']
      });
    }

    // else if (PlanID === 0 && businessType === 'B2C') {
    else {
      configurations = await DB_MODELS.B2C_Plan_Master_Configurations.findOne({
        include: [
          {
            model: DB_MODELS.B2C_CONFIGURATION,
            where: { BusOperatorID },
            attributes: ['isB2CPayment']
          }
        ],
        where: { PlanID },
        limit: 1
      });
    }

    // else if ((PlanID === 1 || PlanID === 2) && businessType === 'B2C') {
    //   configurations = await DB_MODELS.B2C_Plan_Master_Configurations.findOne({
    //     include: [
    //       {
    //         model: DB_MODELS.B2C_CONFIGURATION,
    //         where: { BusOperatorID },
    //         attributes: ['isB2CPayment']
    //       }
    //     ],
    //     where: { PlanID },
    //     limit: 1
    //   });
    // }

    const { isPhone = "Y", isETA = "N", GPSIntervalForParent } = configurations || {};

    const date = new Date();
    const dayName = date.toLocaleString('en-US', { weekday: 'short' });

    const dayMapping = {
      Mon: 'Monday',
      Tue: 'Tuesday',
      Wed: 'Wednesday',
      Thu: 'Thursday',
      Fri: 'Friday',
      Sat: 'Saturday',
      Sun: 'Sunday'
    };
    const day = dayMapping[dayName];

    // Get routes
    // const pickupRoute = await DB_MODELS.PICKUP_ROUTE_MASTER.findOne({
    //   include: [
    //     { model: DB_MODELS.STOPPAGE_MASTER, as: 'FromStoppage', attributes: ['StoppageName'] }
    //   ],
    //   where: {
    //     StudentID: studentId,
    //     SchoolID: schoolId,
    //     [`Pickup${day}`]: 'Y'
    //   },
    //   attributes: ['FromRouteID', 'RouteName', 'StartTime_PickUp', 'EndTime_PickUp', 'FromStoppageID', 'Latitude', 'Longitude']
    // });
    const pickupRoute = await DB_MODELS.STUDENT_MASTER.findOne({
      include: [
        {
          model: DB_MODELS.PICKUP_ROUTE_MASTER,
          // as: 'PickupRoute',
          required: true,
          attributes: ['RouteName', 'StartTime_PickUp', 'EndTime_PickUp'],
        },
        {
          model: DB_MODELS.STOPPAGE_MASTER,
          // as: 'FromStoppage',
          attributes: ['StopageName', 'Latitude', 'Longitude'],
        },
      ],
      where: {
        StudentID: studentId,
        SchoolID: schoolId,
        [`Pickup${day}`]: 'Y',
      },
      attributes: ['FromRouteID', 'FromStoppageID'],
    });

    const dropRoute = await DB_MODELS.STUDENT_MASTER.findOne({
      include: [
        {
          model: DB_MODELS.DROP_ROUTE_MASTER,
          required: true,
          attributes: ['RouteName', 'StartTime_Drop', 'EndTime_Drop'],
        },
        {
          model: DB_MODELS.STOPPAGE_MASTER,
          as: 'ToStoppage',
          attributes: ['StopageName', 'Latitude', 'Longitude'],
        },
      ],
      where: {
        StudentID: studentId,
        SchoolID: schoolId,
        [`Drop${day}`]: 'Y',
      },
      attributes: ['ToRouteID', 'FromRouteID', 'ToStoppageID', 'FromStoppageID'],
    });

    const sbDropRoute = await DB_MODELS.STUDENT_MASTER.findOne({
      include: [
        {
          model: DB_MODELS.DROP_ROUTE_MASTER,
          as: 'StayBackRoute',
          required: true,
          attributes: [['RouteName', 'ToRouteName'], 'StartTime_Drop', 'EndTime_Drop'],
        },
        {
          model: DB_MODELS.STOPPAGE_MASTER,
          as: 'ToStoppage',
          attributes: [['StopageName', 'ToStoppageName'], 'Latitude', 'Longitude'],
        },
      ],
      where: {
        StudentID: studentId,
        SchoolID: schoolId,
        [`StayBackDrop${day}`]: 'Y',
      },
      attributes: ['FromRouteID', 'FromStoppageID', 'StayBackToRouteID', 'ToRouteID', 'ToStoppageID',],
    });

    // -------------------------------

    // Fetch SchoolSection
    const studentSection = await DB_MODELS.STUDENT_MASTER.findOne({
      where: { StudentID: studentId, SchoolID: schoolId },
      attributes: ['SchoolSection'],
      raw: true
    });

    const { SchoolSection } = studentSection;

    // Fetch School Incharge Number
    const school = await DB_MODELS.SCHOOL_MASTER.findOne({
      where: { SchoolID: schoolId },
      attributes: ['PrePrimarySectionInchargeNumber', 'PrimarySectionInchargeNumber', 'SecondarySectionInchargeNumber'],
      raw: true
    });

    let schoolInchargeNumber = '';
    if (SchoolSection === 'Pre Primary' || SchoolSection === 'PrePrimary') {
      schoolInchargeNumber = school.PrePrimarySectionInchargeNumber;
    } else if (SchoolSection === 'Primary') {
      schoolInchargeNumber = school.PrimarySectionInchargeNumber;
    } else if (SchoolSection === 'Secondary') {
      schoolInchargeNumber = school.SecondarySectionInchargeNumber;
    }


    // Clean up phone number if needed
    if (schoolInchargeNumber) {
      const arrString = schoolInchargeNumber.split('-');
      if (arrString.length === 2) {
        schoolInchargeNumber = arrString.join('');
      }
    }

    // Build the response
    const response = {
      isPhone,
      isETA,
      GPSIntervalForParent,
      routes: []
    };

    if (pickupRoute) {
      response.routes.push({
        Type: 'Pickup',
        RouteID: pickupRoute.FromRouteID,
        RouteName: pickupRoute.pickup_route_master.RouteName,
        StoppageID: pickupRoute.FromStoppageID,
        StoppageName: pickupRoute?.stoppage_master?.StopageName || "",
        StoppageStartTime: pickupRoute.pickup_route_master.dataValues.StartTime_PickUp,
        StoppageEndTime: pickupRoute.pickup_route_master.dataValues.EndTime_PickUp,
        Latitude: pickupRoute?.stoppage_master?.Latitude || '0.0',
        Longitude: pickupRoute?.stoppage_master?.Longitude || '0.0',
        SchoolInchargeNumber: schoolInchargeNumber
      });
    }

    if (dropRoute) {
      response.routes.push({
        Type: 'Drop',
        RouteID: dropRoute.ToRouteID,
        RouteName: dropRoute.drop_route_master.RouteName,
        StoppageID: dropRoute.ToStoppageID,
        StoppageName: dropRoute?.ToStoppage?.dataValues?.StopageName,
        StoppageStartTime: dropRoute?.drop_route_master?.dataValues?.StartTime_Drop,
        StoppageEndTime: dropRoute?.drop_route_master?.dataValues?.EndTime_Drop,
        Latitude: dropRoute?.ToStoppage?.dataValues?.Latitude || '0.0',
        Longitude: dropRoute?.ToStoppage?.dataValues?.Longitude || '0.0',
        SchoolInchargeNumber: schoolInchargeNumber
      });
    }

    if (sbDropRoute) {
      response.routes.push({
        Type: 'Drop',
        RouteID: sbDropRoute.StayBackToRouteID,
        RouteName: sbDropRoute.RouteName,
        StoppageID: sbDropRoute.ToStoppageID,
        StoppageName: sbDropRoute.ToStoppage.StoppageName,
        StoppageStartTime: sbDropRoute.StartTime_Drop,
        StoppageEndTime: sbDropRoute.EndTime_Drop,
        Latitude: sbDropRoute.Latitude || '0.0',
        Longitude: sbDropRoute.Longitude || '0.0',
        SchoolInchargeNumber: schoolInchargeNumber
      });
    }

    if (isMessage) {
      response.Message = '';
    }

    return response;

  }
  catch (error) {
    console.log(error);
    new Error("Something went wrong.");
  }
}

module.exports = {
  //   createSession,
  //   regenerateSession,
  //   updatePushToken,
  //   updateImeiToken,
  //   updateLoginInfo,
  //   destroySession,
  syncData,
  fetchConfig,
  mapScreen,
  checkOnGoingTrip,
  getEvents,
  noSchoolFound,
  checkOperatorAvailableOrNot,
  insertStoppage,
  getFile,
  getStudentDetails,
  editStudent,
  getCountries,
  getCity,
  getSchoolByCountry,
  inAppNotification,
  checkEta,
  deleteAccount,
  insertStudent,
  cityForSignUpFirst,
  getSchoolsForDropdown,
  getSchoolRoutesStoppages,
  getStudentInfo,
  getCheckTripStartedOrNo,
  insertDateType,
  imageUpload,
};
