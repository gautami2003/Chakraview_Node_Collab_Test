const { DB_MODELS } = require('../constants/models.constant');
const moment = require("moment");
const dbService = require('./db.service');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const getUser = async (busOperatorID) => {
    try {

        return await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
            where: { BusOperatorID: busOperatorID, },
            attributes: ["EmailID"],
            include: [
                {
                    model: DB_MODELS.USER_MASTER,
                    attributes: ["UserName"],
                    required: true
                },
            ],
            logging: console.log
        });
    } catch (error) {
        throw error;
    }
};

const updateUser = async (busOperatorID, userID, data) => {
    try {
        const selEmail = await DB_MODELS.BUS_OPERATOR_MASTER.findOne({
            attributes: ["EmailID"],
            where: {
                EmailID: data.emailID,
                isDeleted: 'N',
                // BusOperatorID: { [Op.ne]: busOperatorID }
            },
            include: [
                {
                    model: DB_MODELS.USER_MASTER,
                    attributes: ["UserName"],
                    where: {
                        UserName: data.userName,
                        // UserID: { [Op.ne]: userID }
                    },
                    required: true
                },
            ],
            logging: console.log
        });

        if (selEmail) {
            return false;
        } else {
            await DB_MODELS.BUS_OPERATOR_MASTER.update({
                EmailID: data.emailID,
                UpdatedBy: "Admin",
                UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
            }, {
                where: {
                    BusOperatorID: busOperatorID
                }
            })

            await DB_MODELS.USER_MASTER.update({
                UserName: data.userName,
                UpdatedBy: "Admin",
                UpdatedOn: moment().format("YYYY MM DD, h:mm:ss")
            }, {
                where: {
                    UserID: userID
                }
            })

            return true;
        };

    } catch (error) {
        throw error;
    }
};

module.exports = {
    getUser,
    updateUser
};