const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const moment = require("moment");
moment.tz.setDefault("Asia/Kolkata");

// Constants.
const { DB_MODELS } = require("../constants/models.constant");
const { COMMON_MESSAGES } = require("../constants/messages.constant");

// Helpers.
const apiHelper = require("../helpers/api.helper");
const { logError } = require("../utils/logger");

const redisService = require("../services/redis.service");
const paginationConstant = require("../constants/pagination.constant");

const getBusOperator = async (req, res) => {
    const { type, page } = req.query;

    try {
        const totalPage = parseInt(page) || 1;
        const totalLimit = parseInt(paginationConstant.LIMIT);
        const offset = (totalPage - 1) * totalLimit;
        let busOperators;

        if (type == "B2B") {
            busOperators = await DB_MODELS.BUS_OPERATOR_MASTER.findAndCountAll({
                attributes: ["BusOperatorID", "BusOperatorName", "EmailID", "UserID", "OwnerName", "PhoneNumber", "OwnerPhoneNumber", "isActive"],
                where: {
                    BusinessType: type,
                    isDeleted: 'N'
                },
                order: ["BusOperatorName"],
                limit: totalLimit,
                offset: offset,
                raw: true
            });

            for (const operator of busOperators.rows) {
                const data = operator;

                const getSchools = await DB_MODELS.SCHOOL_MASTER.findAll({
                    where: {
                        BusOperatorID: data.BusOperatorID,
                        isDeleted: 'N'
                    },
                    attributes: ["SchoolID", "SchoolName"]
                });

                data.schools = getSchools;
            };
        } else if (type == "B2C") {
            busOperators = await DB_MODELS.BUS_OPERATOR_MASTER.findAndCountAll({
                attributes: ["BusOperatorID", "BusOperatorName", "EmailID", "UserID", "OwnerName", "PhoneNumber", "OwnerPhoneNumber", "isActive"],
                where: {
                    BusinessType: type,
                    isDeleted: 'N'
                },
                order: ["BusOperatorName"],
                limit: totalLimit,
                offset: offset,
                raw: true
            });

            for (const operator of busOperators.rows) {
                const data = operator;

                const getSchools = await DB_MODELS.SCHOOL_MASTER.findAll({
                    where: {
                        BusOperatorID: data.BusOperatorID,
                        isDeleted: 'N'
                    },
                    attributes: ["SchoolID", "SchoolName"]
                });

                data.schools = getSchools;
            };
        } else if (type == "B2C-Retail") {
            busOperators = await DB_MODELS.BUS_OPERATOR_MASTER.findAndCountAll({
                attributes: ["BusOperatorID", "BusOperatorName", "EmailID", "UserID", "OwnerName", "PhoneNumber", "OwnerPhoneNumber", "isActive"],
                where: {
                    BusinessType: type,
                    isDeleted: 'N'
                },
                order: ["BusOperatorName"],
                limit: totalLimit,
                offset: offset,
                raw: true
            });

            for (const operator of busOperators.rows) {
                const data = operator;

                const getSchools = await DB_MODELS.SCHOOL_MASTER.findAll({
                    where: {
                        BusOperatorID: data.BusOperatorID,
                        isDeleted: 'N'
                    },
                    attributes: ["SchoolID", "SchoolName"]
                });

                data.schools = getSchools;
            };
        };
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, { count: busOperators.count, totalLimit: totalLimit, result: busOperators.rows });
    } catch (error) {
        await logError(req, res, "busOperatorController", "getBusOperator", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getBusOperatorNameList = async (req, res) => {
    try {
        const redisKey = `admin_bus_operator_list`;
        const getBusOperatorName = await redisService.getRedisValue(redisKey);
        if (getBusOperatorName) {
            return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, JSON.parse(getBusOperatorName));
        }

        let busOperators = await DB_MODELS.BUS_OPERATOR_MASTER.findAll({
            attributes: ["BusOperatorID", "BusOperatorName"],
            where: {
                isDeleted: 'N'
            },
            group: ['BusOperatorName'],
            order: ["BusOperatorName"]
        });

        const result = busOperators.map((data) => {
            return {
                busOperatorID: data.BusOperatorID,
                busOperatorName: data.BusOperatorName

            }
        })

        await redisService.setRedisValue(redisKey, JSON.stringify(result), 3600);
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);

    } catch (error) {
        await logError(req, res, "busOperatorController", "getBusOperatorNameList", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getBusSingal = async (req, res) => {
    const { id } = req.params;
    try {
        let busOperators = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
            attributes: ["BusOperatorID", "BusOperatorName", "EmailID", "OwnerName", "OwnerPhoneNumber", "isActive"],
            where: {
                BusOperatorID: id,
                isDeleted: 'N'
            },
            raw: true
        });

        if (!busOperators) {
            return apiHelper.success(res, COMMON_MESSAGES.NO_DATA_FOUND, {}, {}, false);
        }
        const getSchools = await DB_MODELS.SCHOOL_MASTER.findAll({
            where: {
                BusOperatorID: busOperators.BusOperatorID,
                isDeleted: 'N'
            },
            attributes: ["SchoolID", "SchoolName"]
        });

        busOperators.schools = getSchools;

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, busOperators);
    } catch (error) {
        await logError(req, res, "busOperatorController", "getBusSingal", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getProfile = async (req, res) => {

    try {
        const busOperatorID = req.user.busOperatorID;
        // const userID = req.user.userID;

        const getProfile = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
            attributes: ["BusOperatorName", "Address1", "Address2", "CityID", "Pincode", "OwnerPhoneNumber", "OwnerName", "PhoneNumber", "EmailID", "WebsiteURL"],
            where: { BusOperatorID: busOperatorID },
            include: [
                {
                    model: DB_MODELS.USER_MASTER,
                    attributes: ["UserName"]
                },
            ],
        });

        const getCity = await DB_MODELS.CITY_MASTER.findOne({
            attributes: ["CityName"],
            where: { CityID: getProfile.CityID },
        });



        const result = {
            busOperatorName: getProfile.BusOperatorName,
            address1: getProfile.Address1,
            address2: getProfile.Address2,
            cityName: getCity.CityName,
            // cityID: getProfile?.city_master?.CityID,
            pincode: getProfile.Pincode,
            ownerPhoneNumber: getProfile.OwnerPhoneNumber,
            ownerName: getProfile.OwnerName,
            phoneNumber: getProfile.PhoneNumber,
            emailID: getProfile.EmailID,
            websiteURL: getProfile.WebsiteURL,
            userName: getProfile?.user_master?.UserName
        }


        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    }
    catch (error) {
        await logError(req, res, "busOperatorController", "getProfile", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const editProfile = async (req, res) => {
    const {
        // busOperatorName,
        // countryID,
        address1,
        address2,
        // cityID,
        pincode,
        ownerPhoneNumber,
        ownerName,
        phoneNumber,
        emailID,
        websiteURL,
        userName } = req.body;

    try {

        const busOperatorID = req.user.busOperatorID;
        const userID = req.user.userID;


        await DB_MODELS.BUS_OPERATOR_MASTER.update(
            {
                // BusOperatorName: busOperatorName,
                // CountryID: countryID,
                Address1: address1,
                Address2: address2,
                // CityID: cityID,
                Pincode: pincode,
                OwnerPhoneNumber: ownerPhoneNumber,
                OwnerName: ownerName,
                PhoneNumber: phoneNumber,
                EmailID: emailID,
                WebsiteURL: websiteURL,
            },
            { where: { BusOperatorID: busOperatorID } }
        );

        await DB_MODELS.USER_MASTER.update(
            { UserName: userName },
            { where: { UserID: userID } }
        )
        // attributes: ["BusOperatorName", "CountryID", "Address1", "Address2", "CityID", "Pincode", "OwnerPhoneNumber", "OwnerName", "PhoneNumber", "EmailID", "WebsiteURL", "TimeZone", "UserName"]


        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED, {}, {});
    }
    catch (error) {
        await logError(req, res, "busOperatorController", "editProfile", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getSummary = async (req, res) => {
    const { id } = req.params;
    try {
        let busOperators = await DB_MODELS.BUS_OPERATOR_MASTER.findAll({
            attributes: ["BusOperatorID", "BusOperatorName"],
            where: {
                isDeleted: 'N',
                BusOperatorID: id
            },
            raw: true
        });
        let summary = [];
        for (let index = 0; index < busOperators.length; index++) {
            const data = busOperators[index];

            let totalBus = await DB_MODELS.BUS_MASTER.count({
                where: {
                    BusOperatorID: data.BusOperatorID,
                    isDeleted: 'N'
                }
            });
            let totalAttendant = await DB_MODELS.BUS_INCHARGE_MASTER.count({
                where: {
                    BusOperatorID: data.BusOperatorID,
                    isDeleted: 'N'
                }
            });
            let totalBannedAttendant = await DB_MODELS.BUS_INCHARGE_MASTER.count({
                where: {
                    BusOperatorID: data.BusOperatorID,
                    isDeleted: 'N',
                    isBan: 'Y'
                }
            });
            let totalUnbannedAttendant = await DB_MODELS.BUS_INCHARGE_MASTER.count({
                where: {
                    BusOperatorID: data.BusOperatorID,
                    isDeleted: 'N',
                    isBan: 'N'
                }
            });
            let totalSchool = await DB_MODELS.SCHOOL_MASTER.count({
                where: {
                    BusOperatorID: data.BusOperatorID,
                    isDeleted: 'N',
                }
            });
            let totalPickupRoute = await DB_MODELS.PICKUP_ROUTE_MASTER.count({
                where: {
                    BusOperatorID: data.BusOperatorID,
                    isDeleted: 'N',
                }
            });
            let totalDropRoute = await DB_MODELS.DROP_ROUTE_MASTER.count({
                where: {
                    BusOperatorID: data.BusOperatorID,
                    isDeleted: 'N',
                }
            });
            let totalStoppage = await DB_MODELS.STOPPAGE_MASTER.count({
                where: {
                    BusOperatorID: data.BusOperatorID,
                    isDeleted: 'N',
                }
            });
            let totalStudent = await DB_MODELS.STUDENT_MASTER.count({
                where: {
                    BusOperatorID: data.BusOperatorID,
                    isDeleted: 'N',
                }
            });
            let totalBannedStudent = await DB_MODELS.STUDENT_MASTER.count({
                where: {
                    BusOperatorID: data.BusOperatorID,
                    isDeleted: 'N',
                    isBan: 'Y'
                }
            });
            let totalUnbannedStudent = await DB_MODELS.STUDENT_MASTER.count({
                where: {
                    BusOperatorID: data.BusOperatorID,
                    isDeleted: 'N',
                    isBan: 'N'
                }
            });
            let totalRouteStoppageTiming = await DB_MODELS.ROUTE_STOPPAGE_TIMING_MASTER.count({
                where: {
                    BusOperatorID: data.BusOperatorID,
                    isDeleted: 'N',
                }
            });
            const result = {
                busOperatorID: data?.BusOperatorID,
                busOperatorName: data.BusOperatorName,
                totalBus: totalBus,
                totalAttendant: totalAttendant,
                totalBannedAttendant: totalBannedAttendant,
                totalUnbannedAttendant: totalUnbannedAttendant,
                totalSchool: totalSchool,
                totalPickupRoute: totalPickupRoute,
                totalDropRoute: totalDropRoute,
                totalStoppage: totalStoppage,
                totalStudent: totalStudent,
                totalBannedStudent: totalBannedStudent,
                totalUnbannedStudent: totalUnbannedStudent,
                totalRouteStoppageTiming: totalRouteStoppageTiming,
            };
            summary.push(result);
        };
        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, summary);
    } catch (error) {
        await logError(req, res, "busOperatorController", "getSummary", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateBusOperator = async (req, res) => {
    const { id } = req.params;
    try {
        await DB_MODELS.BUS_OPERATOR_MASTER.update({
            BusOperatorName: req.body.busOperatorName,
            CountryID: req.body.countryID,
            Address1: req.body.address1,
            Address2: req.body.address2,
            CityID: req.body.cityID,
            Pincode: req.body.pincode,
            PhoneNumber: req.body.phoneNumber,
            EmailID: req.body.emailID,
            WebsiteURL: req.body.websiteURL,
            OwnerName: req.body.ownerName,
            OwnerPhoneNumber: req.body.ownerPhoneNumber,
            UserID: req.body.userID,
            LogoImage: req.body.logoImage,
            isActive: req.body.isActive,
            TC: req.body.tc,
            isPhone: req.body.isPhone,
            isFees: req.body.isFees,
            OfflineLatlongSMSFrequency: req.body.offlineLatlongSMSFrequency,
            Longcode: req.body.longcode,
            BusinessType: req.body.businessType,
            TimeZone: req.body.timeZone,
            isDeleted: req.body.isDeleted,
            BusOperatorLogo: req.body.busOperatorLogo,
            streaming_attendant_app: req.body.streaming_attendant_app,
            streaming_gps_device: req.body.streaming_gps_device,
            primary_streaming_method: req.body.primary_streaming_method,

        },
            { where: { BusOperatorID: id } }
        )

        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
    } catch (error) {
        await logError(req, res, "busOperatorController", "updateBusOperator", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const getConfigurations = async (req, res) => {
    const { id } = req.params;
    const { type } = req.query;
    try {

        let result = {};

        if (type === "B2B") {
            const getData = await DB_MODELS.CONFIGURATION_SMS_LONGCODE_CALL.findOne({
                attributes: ["isPhone", "isWhatsApp", "isNotification2All", "isETA", "AllowSignup",
                    "AllowParentsToCall", "AllowParentsToWhatsAppCall", "AllowParentsToSendSMS", "AllowAttendanceFromCheckbox",
                    "AllowAttendanceFromNFC", "AllowVideoRecording", "isStoppageUpdatable", "isLongcode", "Longcode",
                    "isGoogleAds", "GoogleAdsAPIKey", "OfflineLatlongSMSFrequency", "isSMS", "isNotification", "MessageProviderURL1",
                    "MessageProviderURL2", "isTypeDistanceMessage", "isTypeDistanceMobileNofication", "isTypeDistanceMessagePrePrimary",
                    "isTypeDistanceMessagePrimary", "isTypeDistanceMessageSecondary", "isTypeSMS2", "isTypeSMS2MobileNofication",
                    "isTypeSMS3", "isTypeSMS3MobileNofication", "isTypeIndividualSMS", "isTypeIndividualMobileNofication",
                    "isTypeGroupSMS", "isTypeGroupMobileNofication", "isTypePortalSMS", "isTypePortalMobileNofication",
                    "isLateStartSMSToBusOperator", "isLateStartMobileNotificationToBusOperator", "isPickup1SMS", "isPickup1MobileNofication",
                    "isPickup2SMS", "isPickup2MobileNofication", "isDrop1SMS", "isDrop1MobileNofication", "isDrop2SMS",
                    "isDrop2MobileNofication", "SMSServiceDisableMessage", "IndividualSMS1", "IndividualSMS2", "IndividualSMS3",
                    "IndividualSMS4", "IndividualSMS5", "GroupSMS1", "GroupSMS2", "GPSInterval", "GPSIntervalForParent", "isAutoActive",
                    "streaming_attendant_app", "streaming_iot_device", "primary_streaming_method"],
                where: { BusOperatorID: id },
                raw: true,
            });
            result.isPhone = getData?.isPhone || "";
            result.isWhatsApp = getData?.isWhatsApp || "";
            result.isNotification2All = getData?.isNotification2All || "";
            result.isETA = getData?.isETA || "";
            result.allowSignup = getData?.AllowSignup || "";
            result.allowParentsToCall = getData?.AllowParentsToCall || "";
            result.allowParentsToWhatsAppCall = getData?.AllowParentsToWhatsAppCall || "";
            result.allowParentsToSendSMS = getData?.AllowParentsToSendSMS || "";
            result.allowAttendanceFromCheckbox = getData?.AllowAttendanceFromCheckbox || "";
            result.allowAttendanceFromNFC = getData?.AllowAttendanceFromNFC || "";
            result.allowVideoRecording = getData?.AllowVideoRecording || "";
            result.isStoppageUpdatable = getData?.isStoppageUpdatable || "";
            result.isLongcode = getData?.isLongcode || "";
            result.longcode = getData?.Longcode || "";
            result.isGoogleAds = getData?.isGoogleAds || "";
            result.googleAdsAPIKey = getData?.GoogleAdsAPIKey || "";
            result.offlineLatlongSMSFrequency = getData?.OfflineLatlongSMSFrequency || "";
            result.isSMS = getData?.isSMS || "";
            result.isNotification = getData?.isNotification || "";
            result.messageProviderURL1 = getData?.MessageProviderURL1 || "";
            result.messageProviderURL2 = getData?.MessageProviderURL2 || "";
            result.isTypeDistanceMessage = getData?.isTypeDistanceMessage || "";
            result.isTypeDistanceMobileNofication = getData?.isTypeDistanceMobileNofication || "";
            result.isTypeDistanceMessagePrePrimary = getData?.isTypeDistanceMessagePrePrimary || "";
            result.isTypeDistanceMessagePrimary = getData?.isTypeDistanceMessagePrimary || "";
            result.isTypeDistanceMessageSecondary = getData?.isTypeDistanceMessageSecondary || "";
            result.isTypeSMS2 = getData?.isTypeSMS2 || "";
            result.isTypeSMS2MobileNofication = getData?.isTypeSMS2MobileNofication || "";
            result.isTypeSMS3 = getData?.isTypeSMS3 || "";
            result.isTypeSMS3MobileNofication = getData?.isTypeSMS3MobileNofication || "";
            result.isTypeIndividualSMS = getData?.isTypeIndividualSMS || "";
            result.isTypeIndividualMobileNofication = getData?.isTypeIndividualMobileNofication || "";
            result.isTypeGroupSMS = getData?.isTypeGroupSMS || "";
            result.isTypeGroupMobileNofication = getData?.isTypeGroupMobileNofication || "";
            result.isTypePortalSMS = getData?.isTypePortalSMS || "";
            result.isTypePortalMobileNofication = getData?.isTypePortalMobileNofication || "";
            result.isLateStartSMSToBusOperator = getData?.isLateStartSMSToBusOperator || "";
            result.isLateStartMobileNotificationToBusOperator = getData?.isLateStartMobileNotificationToBusOperator || "";
            result.isPickup1SMS = getData?.isPickup1SMS || "";
            result.isPickup1MobileNofication = getData?.isPickup1MobileNofication || "";
            result.isPickup2SMS = getData?.isPickup2SMS || "";
            result.isPickup2MobileNofication = getData?.isPickup2MobileNofication || "";
            result.isDrop1SMS = getData?.isDrop1SMS || "";
            result.isDrop1MobileNofication = getData?.isDrop1MobileNofication || "";
            result.isDrop2SMS = getData?.isDrop2SMS || "";
            result.isDrop2MobileNofication = getData?.isDrop2MobileNofication || "";
            result.smsServiceDisableMessage = getData?.SMSServiceDisableMessage || "";
            result.individualSMS1 = getData?.IndividualSMS1 || "";
            result.individualSMS2 = getData?.IndividualSMS2 || "";
            result.individualSMS3 = getData?.IndividualSMS3 || "";
            result.individualSMS4 = getData?.IndividualSMS4 || "";
            result.individualSMS5 = getData?.IndividualSMS5 || "";
            result.groupSMS1 = getData?.GroupSMS1 || "";
            result.groupSMS2 = getData?.GroupSMS2 || "";
            result.gpsInterval = getData?.GPSInterval || "";
            result.gpsIntervalForParent = getData?.GPSIntervalForParent || "";
            result.isAutoActive = getData?.isAutoActive || "";
            result.streamingAttendantApp = getData?.streaming_attendant_app || "";
            result.streamingIotDevice = getData?.streaming_iot_device || "";
            result.primaryStreamingMethod = getData?.primary_streaming_method || "";

        } else if (type === "B2C" || type === "B2C-Retail") {
            const getData = await DB_MODELS.CONFIGURATION_SMS_LONGCODE_CALL.findAll({
                attributes: ["isPhone", "isWhatsApp", "isETA", "AllowSignup", "AllowParentsToCall",
                    "AllowParentsToWhatsAppCall", "AllowParentsToSendSMS", "AllowAttendanceFromCheckbox", "AllowAttendanceFromNFC",
                    "AllowVideoRecording", "isStoppageUpdatable", "isLongcode", "Longcode", "isGoogleAds", "GoogleAdsAPIKey",
                    "OfflineLatlongSMSFrequency", "isSMS", "isNotification", "MessageProviderURL1", "MessageProviderURL2",
                    "isTypeDistanceMessage", "isTypeDistanceMobileNofication", "isTypeDistanceMessagePrePrimary", "isTypeDistanceMessagePrimary",
                    "isTypeDistanceMessageSecondary", "isTypeSMS2", "isTypeSMS2MobileNofication", "isTypeSMS3", "isTypeSMS3MobileNofication",
                    "isTypeIndividualSMS", "isTypeIndividualMobileNofication", "isTypeGroupSMS", "isTypeGroupMobileNofication", "isTypePortalSMS",
                    "isTypePortalMobileNofication", "isLateStartSMSToBusOperator", "isLateStartMobileNotificationToBusOperator", "isPickup1SMS",
                    "isPickup1MobileNofication", "isPickup2SMS", "isPickup2MobileNofication", "isDrop1SMS", "isDrop1MobileNofication",
                    "isDrop2SMS", "isDrop2MobileNofication", "SMSServiceDisableMessage", "IndividualSMS1", "IndividualSMS2", "IndividualSMS3",
                    "IndividualSMS4", "IndividualSMS5", "GroupSMS1", "GroupSMS2", "GPSInterval", "GPSIntervalForParent", "isAutoActive"],
                where: { BusOperatorID: id },
                include: {
                    model: DB_MODELS.B2C_CONFIGURATION,
                    attributes: ["isB2CPayment"],
                    where: { BusOperatorID: id },
                },
                raw: true,
                logging: console.log
            });

            let resultArray = getData.map((data) => {
                return {
                    isPhone: data?.isPhone || "",
                    isWhatsApp: data?.isWhatsApp || "",
                    isETA: data?.isETA || "",
                    allowSignup: data?.AllowSignup || "",
                    allowParentsToCall: data?.AllowParentsToCall || "",
                    allowParentsToWhatsAppCall: data?.AllowParentsToWhatsAppCall || "",
                    allowParentsToSendSMS: data?.AllowParentsToSendSMS || "",
                    allowAttendanceFromCheckbox: data?.AllowAttendanceFromCheckbox || "",
                    allowAttendanceFromNFC: data?.AllowAttendanceFromNFC || "",
                    allowVideoRecording: data?.AllowVideoRecording || "",
                    isStoppageUpdatable: data?.isStoppageUpdatable || "",
                    isLongcode: data?.isLongcode || "",
                    longcode: data?.Longcode || "",
                    isGoogleAds: data?.isGoogleAds || "",
                    googleAdsAPIKey: data?.GoogleAdsAPIKey || "",
                    offlineLatlongSMSFrequency: data?.OfflineLatlongSMSFrequency || "",
                    isSMS: data?.isSMS || "",
                    isNotification: data?.isNotification || "",
                    messageProviderURL1: data?.MessageProviderURL1 || "",
                    messageProviderURL2: data?.MessageProviderURL2 || "",
                    isTypeDistanceMessage: data?.isTypeDistanceMessage || "",
                    isTypeDistanceMobileNofication: data?.isTypeDistanceMobileNofication || "",
                    isTypeDistanceMessagePrePrimary: data?.isTypeDistanceMessagePrePrimary || "",
                    isTypeDistanceMessagePrimary: data?.isTypeDistanceMessagePrimary || "",
                    isTypeDistanceMessageSecondary: data?.isTypeDistanceMessageSecondary || "",
                    isTypeSMS2: data?.isTypeSMS2 || "",
                    isTypeSMS2MobileNofication: data?.isTypeSMS2MobileNofication || "",
                    isTypeSMS3: data?.isTypeSMS3 || "",
                    isTypeSMS3MobileNofication: data?.isTypeSMS3MobileNofication || "",
                    isTypeIndividualSMS: data?.isTypeIndividualSMS || "",
                    isTypeIndividualMobileNofication: data?.isTypeIndividualMobileNofication || "",
                    isTypeGroupSMS: data?.isTypeGroupSMS || "",
                    isTypeGroupMobileNofication: data?.isTypeGroupMobileNofication || "",
                    isTypePortalSMS: data?.isTypePortalSMS || "",
                    isTypePortalMobileNofication: data?.isTypePortalMobileNofication || "",
                    isLateStartSMSToBusOperator: data?.isLateStartSMSToBusOperator || "",
                    isLateStartMobileNotificationToBusOperator: data?.isLateStartMobileNotificationToBusOperator || "",
                    isPickup1SMS: data?.isPickup1SMS || "",
                    isPickup1MobileNofication: data?.isPickup1MobileNofication || "",
                    isPickup2SMS: data?.isPickup2SMS || "",
                    isPickup2MobileNofication: data?.isPickup2MobileNofication || "",
                    isDrop1SMS: data?.isDrop1SMS || "",
                    isDrop1MobileNofication: data?.isDrop1MobileNofication || "",
                    isDrop2SMS: data?.isDrop2SMS || "",
                    isDrop2MobileNofication: data?.isDrop2MobileNofication || "",
                    smsServiceDisableMessage: data?.SMSServiceDisableMessage || "",
                    individualSMS1: data?.IndividualSMS1 || "",
                    individualSMS2: data?.IndividualSMS2 || "",
                    individualSMS3: data?.IndividualSMS3 || "",
                    individualSMS4: data?.IndividualSMS4 || "",
                    individualSMS5: data?.IndividualSMS5 || "",
                    groupSMS1: data?.GroupSMS1 || "",
                    groupSMS2: data?.GroupSMS2 || "",
                    gpsInterval: data?.GPSInterval || "",
                    gpsIntervalForParent: data?.GPSIntervalForParent || "",
                    isAutoActive: data?.isAutoActive || ""
                };
            })
            result = resultArray

        } else {
            return apiHelper.success(res, COMMON_MESSAGES.DATA_NOT_FOUND, {}, {}, false);
        }
        // await DB_MODELS.CONFIGURATION_SMS_LONGCODE_CALL.update({
        //     isPhone: req.body.isPhone,
        //     isWhatsApp: req.body.isWhatsApp,
        //     isETA: req.body.isETA,
        //     isNotificationToAll: req.body.isNotificationToAll,
        //     AllowSignup: req.body.allowSignup,
        //     AllowParentsToCall: req.body.allowParentsToCall,
        //     AllowParentsToWhatsAppCall: req.body.allowParentsToWhatsAppCall,
        //     AllowParentsToSendSMS: req.body.allowParentsToSendSMS,
        //     AllowAttendanceFromCheckbox: req.body.allowAttendanceFromCheckbox,
        //     AllowAttendanceFromNFC: req.body.allowAttendanceFromNFC,
        //     AllowVideoRecording: req.body.allowVideoRecording,
        //     isStoppageUpdatable: req.body.isStoppageUpdatable,
        //     isLongcode: req.body.isLongcode,
        //     Longcode: req.body.longcode,
        //     isGoogleAds: req.body.isGoogleAds,
        //     GoogleAdsAPIKey: req.body.googleAdsAPIKey,
        //     OfflineLatlongSMSFrequency: req.body.offlineLatlongSMSFrequency,
        //     isSMS: req.body.isSMS,
        //     isNotification: req.body.isNotification,
        //     MessageProviderURL1: req.body.messageProviderURL1,
        //     MessageProviderURL2: req.body.messageProviderURL2,
        //     isTypeDistanceMessage: req.body.isTypeDistanceMessage,
        //     isTypeDistanceMobileNofication: req.body.isTypeDistanceMobileNofication,
        //     isTypeDistanceMessagePrePrimary: req.body.isTypeDistanceMessagePrePrimary,
        //     isTypeDistanceMessagePrimary: req.body.isTypeDistanceMessagePrimary,
        //     isTypeDistanceMessageSecondary: req.body.isTypeDistanceMessageSecondary,
        //     isTypeSMS2: req.body.isTypeSMS2,
        //     isTypeSMS2MobileNofication: req.body.isTypeSMS2MobileNofication,
        //     isTypeSMS3: req.body.isTypeSMS3,
        //     isTypeSMS3MobileNofication: req.body.isTypeSMS3MobileNofication,
        //     isTypeIndividualSMS: req.body.isTypeIndividualSMS,
        //     isTypeIndividualMobileNofication: req.body.isTypeIndividualMobileNofication,
        //     isTypeGroupSMS: req.body.isTypeGroupSMS,
        //     isTypeGroupMobileNofication: req.body.isTypeGroupMobileNofication,
        //     isTypePortalSMS: req.body.isTypePortalSMS,
        //     isTypePortalMobileNofication: req.body.isTypePortalMobileNofication,
        //     isLateStartSMSToBusOperator: req.body.isLateStartSMSToBusOperator,
        //     isLateStartMobileNotificationToBusOperator: req.body.isLateStartMobileNotificationToBusOperator,
        //     isPickup1SMS: req.body.isPickup1SMS,
        //     isPickup1MobileNofication: req.body.isPickup1MobileNofication,
        //     isPickup2SMS: req.body.isPickup2SMS,
        //     isPickup2MobileNofication: req.body.isPickup2MobileNofication,
        //     isDrop1SMS: req.body.isDrop1SMS,
        //     isDrop1MobileNofication: req.body.isDrop1MobileNofication,
        //     isDrop2SMS: req.body.isDrop2SMS,
        //     isDrop2MobileNofication: req.body.isDrop2MobileNofication,
        //     isAutoActive: req.body.isAutoActive,
        //     SMSServiceDisableMessage: req.body.smsServiceDisableMessage,
        //     IndividualSMS1: req.body.individualSMS1,
        //     IndividualSMS2: req.body.individualSMS2,
        //     IndividualSMS3: req.body.individualSMS3,
        //     IndividualSMS4: req.body.individualSMS4,
        //     IndividualSMS5: req.body.individualSMS5,
        //     GroupSMS1: req.body.groupSMS1,
        //     GroupSMS2: req.body.groupSMS2,
        //     GPSInterval: req.body.gpsInterval,
        //     DistanceInterval: req.body.distanceInterval,
        //     ExitPasswordForLauncher: req.body.exitPasswordForLauncher,
        //     GPSIntervalForParent: req.body.gpsIntervalForParent,
        //     streaming_attendant_app: req.body.streaming_attendant_app,
        //     streaming_iot_device: req.body.streaming_iot_device,
        //     primary_streaming_method: req.body.primary_streaming_method,
        // },
        //     { where: { BusOperatorID: id } }
        // );

        return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
    } catch (error) {
        await logError(req, res, "busOperatorController", "getConfigurations", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const updateConfigurations = async (req, res) => {
    const { id } = req.params;
    try {

        await DB_MODELS.CONFIGURATION_SMS_LONGCODE_CALL.update({
            isPhone: req.body.isPhone,
            isWhatsApp: req.body.isWhatsApp,
            isETA: req.body.isETA,
            isNotificationToAll: req.body.isNotificationToAll,
            AllowSignup: req.body.allowSignup,
            AllowParentsToCall: req.body.allowParentsToCall,
            AllowParentsToWhatsAppCall: req.body.allowParentsToWhatsAppCall,
            AllowParentsToSendSMS: req.body.allowParentsToSendSMS,
            AllowAttendanceFromCheckbox: req.body.allowAttendanceFromCheckbox,
            AllowAttendanceFromNFC: req.body.allowAttendanceFromNFC,
            AllowVideoRecording: req.body.allowVideoRecording,
            isStoppageUpdatable: req.body.isStoppageUpdatable,
            isLongcode: req.body.isLongcode,
            Longcode: req.body.longcode,
            isGoogleAds: req.body.isGoogleAds,
            GoogleAdsAPIKey: req.body.googleAdsAPIKey,
            OfflineLatlongSMSFrequency: req.body.offlineLatlongSMSFrequency,
            isSMS: req.body.isSMS,
            isNotification: req.body.isNotification,
            MessageProviderURL1: req.body.messageProviderURL1,
            MessageProviderURL2: req.body.messageProviderURL2,
            isTypeDistanceMessage: req.body.isTypeDistanceMessage,
            isTypeDistanceMobileNofication: req.body.isTypeDistanceMobileNofication,
            isTypeDistanceMessagePrePrimary: req.body.isTypeDistanceMessagePrePrimary,
            isTypeDistanceMessagePrimary: req.body.isTypeDistanceMessagePrimary,
            isTypeDistanceMessageSecondary: req.body.isTypeDistanceMessageSecondary,
            isTypeSMS2: req.body.isTypeSMS2,
            isTypeSMS2MobileNofication: req.body.isTypeSMS2MobileNofication,
            isTypeSMS3: req.body.isTypeSMS3,
            isTypeSMS3MobileNofication: req.body.isTypeSMS3MobileNofication,
            isTypeIndividualSMS: req.body.isTypeIndividualSMS,
            isTypeIndividualMobileNofication: req.body.isTypeIndividualMobileNofication,
            isTypeGroupSMS: req.body.isTypeGroupSMS,
            isTypeGroupMobileNofication: req.body.isTypeGroupMobileNofication,
            isTypePortalSMS: req.body.isTypePortalSMS,
            isTypePortalMobileNofication: req.body.isTypePortalMobileNofication,
            isLateStartSMSToBusOperator: req.body.isLateStartSMSToBusOperator,
            isLateStartMobileNotificationToBusOperator: req.body.isLateStartMobileNotificationToBusOperator,
            isPickup1SMS: req.body.isPickup1SMS,
            isPickup1MobileNofication: req.body.isPickup1MobileNofication,
            isPickup2SMS: req.body.isPickup2SMS,
            isPickup2MobileNofication: req.body.isPickup2MobileNofication,
            isDrop1SMS: req.body.isDrop1SMS,
            isDrop1MobileNofication: req.body.isDrop1MobileNofication,
            isDrop2SMS: req.body.isDrop2SMS,
            isDrop2MobileNofication: req.body.isDrop2MobileNofication,
            isAutoActive: req.body.isAutoActive,
            SMSServiceDisableMessage: req.body.smsServiceDisableMessage,
            IndividualSMS1: req.body.individualSMS1,
            IndividualSMS2: req.body.individualSMS2,
            IndividualSMS3: req.body.individualSMS3,
            IndividualSMS4: req.body.individualSMS4,
            IndividualSMS5: req.body.individualSMS5,
            GroupSMS1: req.body.groupSMS1,
            GroupSMS2: req.body.groupSMS2,
            GPSInterval: req.body.gpsInterval,
            DistanceInterval: req.body.distanceInterval,
            ExitPasswordForLauncher: req.body.exitPasswordForLauncher,
            GPSIntervalForParent: req.body.gpsIntervalForParent,
            streaming_attendant_app: req.body.streaming_attendant_app,
            streaming_iot_device: req.body.streaming_iot_device,
            primary_streaming_method: req.body.primary_streaming_method,
        },
            { where: { BusOperatorID: id } }
        );

        return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
    } catch (error) {
        await logError(req, res, "busOperatorController", "updateConfigurations", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

const deleteBusOperator = async (req, res) => {
    const { id } = req.params;
    try {

        const deleteBusOperator = await DB_MODELS.BUS_OPERATOR_MASTER.update(
            { isDeleted: 'Y' },
            {
                where: { BusOperatorID: id }
            }
        );
        if (deleteBusOperator > 0) {
            result = COMMON_MESSAGES.RESOURCE_DELETED;
        }
        else {
            result = COMMON_MESSAGES.DELETE_ERROR;
        }
        return apiHelper.success(res, result, {});
    } catch (error) {
        await logError(req, res, "busOperatorController", "deleteBusOperator", error, {});
        return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
    }
};

module.exports = {
    getBusOperator,
    getBusOperatorNameList,
    getBusSingal,
    getProfile,
    editProfile,
    getSummary,
    getConfigurations,
    updateConfigurations,
    updateBusOperator,
    deleteBusOperator
};
