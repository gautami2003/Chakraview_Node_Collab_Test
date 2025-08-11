// const RedisClient = require('../configs/redis.config');
const moment = require("moment");
const { DB_MODELS } = require('../constants/models.constant');

const getAllSchool = async (id) => {
    try {
        return await DB_MODELS.SCHOOL_MASTER.findAll({
            where: { BusOperatorID: id, isDeleted: 'N' },
            attributes: ["SchoolID", "SchoolName", "Address1", "Address2", "Pincode", "PrePrimarySectionInchargeName", "PrePrimarySectionInchargeNumber", "PrimarySectionInchargeName", "PrimarySectionInchargeNumber", "SecondarySectionInchargeName", "SecondarySectionInchargeNumber", "Latitude", "Longitude"],
            include: [
                {
                    model: DB_MODELS.COUNTRY_MASTER,
                    attributes: ["CountryName"]
                },
                {
                    model: DB_MODELS.CITY_MASTER,
                    attributes: ["CityName"]
                }
            ],
            // raw: true
        })
    } catch (error) {
        throw error;
    }
};

const getSchoolName = async (busOperatorId) => {
    try {
        const whereConditionFees = {
            isDeleted: "N",
            ...(busOperatorId && { BusOperatorID: busOperatorId }),
        };
        return await DB_MODELS.SCHOOL_MASTER.findAll({
            where: whereConditionFees,
            attributes: ["SchoolID", "SchoolName"],
            group: ['SchoolName'],
            order: ["SchoolName"]
        })
    } catch (error) {
        throw error;
    }
};

const getSchoolHolidays = async (id) => {
    try {
        return await DB_MODELS.SCHOOL_HOLIDAYS.findAll({
            where: { BusOperatorID: id, isDeleted: 'N' },
            attributes: ["SchoolHolidaysID", "StartDate", "EndDate", "Event", "Type", "Standard"],
            include: [
                {
                    model: DB_MODELS.SCHOOL_MASTER,
                    attributes: ["SchoolName"]
                },
            ],
        })
    } catch (error) {
        throw error;
    }
};

const schoolFeesDiscounts = async (schoolID, routeType, type, standard) => {
    try {
        const whereCondition = {
            school_id: schoolID,
            route_type: routeType,
            pay_period: type,
        };
        if (standard) {
            whereCondition.student_standard = standard;
        }
        return await DB_MODELS.SCHOOL_FEES_DISCOUNT.findOne({
            // where: { school_id: schoolID, route_type: routeType, pay_period: type },
            where: whereCondition,
            attributes: ["route_type", "discount", "pay_period", "student_standard"],
        })
    } catch (error) {
        throw error;
    }
};

const getSchoolFeesDiscounts = async (schoolID) => {
    try {
        return await DB_MODELS.SCHOOL_FEES_DISCOUNT.findAll({
            where: { school_id: schoolID, route_type: !null },
        })
    } catch (error) {
        throw error;
    }
};

const createSchool = async (id, data) => {
    try {
        const schoolCreate = await DB_MODELS.SCHOOL_MASTER.create({
            BusOperatorID: id,
            SchoolName: data.schoolName,
            CountryID: data.countryID,
            Address1: data.address1,
            Address2: data.address2,
            CityID: data.cityID,
            Pincode: data.pincode,
            PrePrimarySectionInchargeName: data.prePrimarySectionInchargeName,
            PrePrimarySectionInchargeNumber: data.prePrimarySectionInchargeNumber,
            PrimarySectionInchargeName: data.primarySectionInchargeName,
            PrimarySectionInchargeNumber: data.primarySectionInchargeNumber,
            SecondarySectionInchargeName: data.secondarySectionInchargeName,
            SecondarySectionInchargeNumber: data.secondarySectionInchargeNumber,
            Latitude: data.latitude,
            Longitude: data.longitude,
            SchoolLogo: data.schoolLogo,
            isDeleted: "N",
            CreatedBy: "Admin",
            CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
        });

        if (schoolCreate) {
            let insertData = {
                BusOperatorID: id,
                SchoolID: schoolCreate.SchoolID,
                RouteType: "Pickup",
                SchoolSection: "Pre Primary,Primary,Secondary",
                CreatedOn: moment().format("YYYY MM DD, h:mm:ss")
            }
            await DB_MODELS.CONFIGURE_DISTANCE_SMS.create(insertData)
            insertData.RouteType = "Drop"
            await DB_MODELS.CONFIGURE_DISTANCE_SMS.create(insertData)
            return true
        } else {
            return false
        }

    } catch (error) {
        throw error;
    }
};

const updateSchool = async (id, data) => {
    try {
        const schoolUpdate = await DB_MODELS.SCHOOL_MASTER.update({
            SchoolName: data.schoolName,
            CountryID: data.countryID,
            Address1: data.address1,
            Address2: data.address2,
            CityID: data.cityID,
            Pincode: data.pincode,
            PrePrimarySectionInchargeName: data.prePrimarySectionInchargeName,
            PrePrimarySectionInchargeNumber: data.prePrimarySectionInchargeNumber,
            PrimarySectionInchargeName: data.primarySectionInchargeName,
            PrimarySectionInchargeNumber: data.primarySectionInchargeNumber,
            SecondarySectionInchargeName: data.secondarySectionInchargeName,
            SecondarySectionInchargeNumber: data.secondarySectionInchargeNumber,
            Latitude: data.latitude,
            Longitude: data.longitude,
            SchoolLogo: data.schoolLogo,
            UpdatedBy: "Admin",
            UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
        },
            {
                where: { SchoolID: id }
            }
        );

        if (schoolUpdate) {

            return true
        } else {
            return false
        }

    } catch (error) {
        throw error;
    }
};

const deleteSchool = async (id) => {
    try {
        return await DB_MODELS.SCHOOL_MASTER.update({
            isDeleted: 'Y',
        }, {
            where: { SchoolID: id }
        })
    } catch (error) {
        throw error;
    }
};

const getSchoolCount = async () => {
    try {
        return await DB_MODELS.SCHOOL_MASTER.count({
            where: {
                isDeleted: 'N'
            }
        });
    } catch (error) {
        throw error;
    }
};
module.exports = {
    getAllSchool,
    getSchoolName,
    getSchoolHolidays,
    schoolFeesDiscounts,
    getSchoolFeesDiscounts,
    createSchool,
    updateSchool,
    deleteSchool,
    getSchoolCount
};