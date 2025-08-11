const { UNAUTHORIZED_ACCESS } = require('../constants/http-status-code.constant');
const { ROLE_MESSAGES } = require('../constants/messages.constant');
const apiHelper = require('../helpers/api.helper');

const roleGuardMiddleware = (rolesArr) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (rolesArr.indexOf(role) === -1) {
      return apiHelper.failure(
        res,
        ROLE_MESSAGES.UNAUTHORIZED_ACCESS,
        [],
        UNAUTHORIZED_ACCESS
      );
    }
    next();
  };
};

module.exports = roleGuardMiddleware;