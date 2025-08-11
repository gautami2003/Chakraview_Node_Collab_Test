const { DB_MODELS } = require('../constants/models.constant');
const moment = require("moment");

const getSchoolsAndStandardByBusOperatorID = async (busOperatorID) => {
    try {
        const records = await DB_MODELS.STUDENT_MASTER.findAll({
            attributes: ['SchoolID', 'StudentStandard'],
            where: { BusOperatorID: busOperatorID },
            include: [
                {
                    model: DB_MODELS.SCHOOL_MASTER,
                    as: 'school_master',
                    attributes: ['SchoolName', 'BusOperatorID'],

                }
            ]
        });

        const school = {};

        for (const record of records) {
            const schoolId = record.SchoolID;
            const schoolName = record.school_master.SchoolName;
            const standards = (record.StudentStandard).split(',').map(std => std)

            if (!school[schoolId]) {
                school[schoolId] = {
                    SchoolID: schoolId,
                    SchoolName: schoolName,
                    standards: []
                };
            }

            for (const std of standards) {
                if (!school[schoolId].standards.find(s => s.StudentStandard === std)) {
                    school[schoolId].standards.push({ StudentStandard: std });
                }
            }
        }
        return {
            schools: Object.values(school)
        };
    }
    catch (error) {
        throw error;
    }
};

const getSchoolsAndStandard = async (busOperatorId) => {
    try {
        const records = await DB_MODELS.CONFIGURE_DISTANCE_SMS.findAll({
            attributes: ['SchoolID', 'StudentStandard'],
            where: { BusOperatorID: busOperatorId },
            include: [
                {
                    model: DB_MODELS.SCHOOL_MASTER,
                    as: 'school_master',
                    attributes: ['SchoolName'],
                }
            ]
        });

        const school = {};

        for (const record of records) {
            const schoolId = record.SchoolID;
            const schoolName = record.school_master.SchoolName;
            const standards = (record.StudentStandard).split(',').map(std => std);


            if (!school[schoolId]) {
                school[schoolId] = {
                    SchoolID: schoolId,
                    SchoolName: schoolName,
                    standards: []
                };
            }
            for (const std of standards) {
                if (!school[schoolId].standards.find(s => s.StudentStandard === std)) {
                    school[schoolId].standards.push({ StudentStandard: std });
                }
            }
        }
        return {
            schools: Object.values(school)
        };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

const updateSchoolandStandard = async (id, data) => {
    try {
        return await DB_MODELS.CONFIGURE_DISTANCE_SMS.update(
            {
                BusOperatorID: data.busOperatorID,
                SchoolID: data.schoolID,
                RouteType: data.routeType,
                SchoolSection: data.schoolSection,
                StudentStandard: data.studentStandard,
                CreatedBy: "Admin",
                CreatedOn: moment().format("YYYY-MM-DD HH:mm:ss")
            },
            {
                where: { DistanceSMSConfigurationID: id }
            }
        );
    }
    catch (error) {
        throw error;
    }
};

module.exports = {
    getSchoolsAndStandardByBusOperatorID,
    getSchoolsAndStandard,
    updateSchoolandStandard
};
