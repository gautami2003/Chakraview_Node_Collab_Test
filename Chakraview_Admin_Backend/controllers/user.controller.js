// const { RESET_PASSWORD_URL } = require('../configs/env.config');
const { BAD_REQUEST } = require('../constants/http-status-code.constant');
const {
  USER_MESSAGES,
  COMMON_MESSAGES,
  AUTH_MESSAGES
} = require('../constants/messages.constant');
const { ROLES } = require('../constants/role.constant');
const { USER_STATUS } = require('../constants/user-status.constant');
const apiHelper = require('../helpers/api.helper');
const userService = require('../services/user.service');
const { logError } = require('../utils/logger');

const getUser = async (req, res) => {
  try {
    const busOperatorID = req.user.busOperatorID;
    const data = await userService.getUser(busOperatorID)

    const result = {
      emailID: data.EmailID,
      userName: data.user_master.UserName
    }
    return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, result);
  } catch (error) {
    await logError(req, res, 'usercontroller', 'getUser', error, {});
    return apiHelper.failure(res, error.message);
  }
};

const updateUser = async (req, res) => {
  const { body } = req;
  try {
    const busOperatorID = req.user.busOperatorID;
    const userID = req.user.userID;

    const data = await userService.updateUser(busOperatorID, userID, body)
    if (data) {
      return apiHelper.success(res, COMMON_MESSAGES.RESOURCE_UPDATED);
    } else {
      return apiHelper.success(res, COMMON_MESSAGES.EMAIL_USERNAME_EXISTS);
    }
  } catch (error) {
    await logError(req, res, 'usercontroller', 'updateUser', error, {});
    return apiHelper.failure(res, error.message);
  }
};


module.exports = {
  getUser,
  updateUser
};