const { DB_MODELS } = require('../constants/models.constant');

const createHoliday = async (data) => {
    try {
        return await DB_MODELS.SCHOOL_HOLIDAYS.create(data);
    }
    catch (error) {
        throw error;
    }
};

const getSchoolHolidays = async () => {
    try {
        return await DB_MODELS.SCHOOL_HOLIDAYS.findAll({
            where: { isDeleted: 'N' },
            attributes: ["SchoolHolidaysID", "StartDate", "EndDate", "Event", "Type", "Standard"],
        });
    } catch (error) {
        throw error;




        
    }
};

const getSingleHoliday = async (id) => {
    try {
        return await DB_MODELS.SCHOOL_HOLIDAYS.findOne({
            where: { SchoolHolidaysID: id, isDeleted: 'N' },
            attributes: ["SchoolHolidaysID", "StartDate", "EndDate", "Event", "Type", "Standard"]
        });
    }
    catch (error) {
        throw error;
    }
};

const deleteHoliday = async (id) => {
    try {
        return await DB_MODELS.SCHOOL_HOLIDAYS.update({
            isDeleted: 'Y',
        },
            {
                where: { SchoolHolidaysID: id }
            });
    }
    catch (error) {
        throw error;
    }
};

const updateHoliday = async (id, data) => {
    try {
        return await DB_MODELS.SCHOOL_HOLIDAYS.update(
            data,
            { where: { SchoolHolidaysID: id, isDeleted: 'N' } }
        );
    }
    catch (error) {
        throw error;
    }
};

module.exports = {
    getSchoolHolidays,
    getSingleHoliday,
    deleteHoliday,
    updateHoliday,
    createHoliday
}

