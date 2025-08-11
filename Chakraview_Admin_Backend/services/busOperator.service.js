const { DB_MODELS } = require('../constants/models.constant');

const getBusOperatorCount = async () => {
    try {
        return await DB_MODELS.BUS_OPERATOR_MASTER.count({
            where: {
                isDeleted: 'N'
            }
        });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getBusOperatorCount
}