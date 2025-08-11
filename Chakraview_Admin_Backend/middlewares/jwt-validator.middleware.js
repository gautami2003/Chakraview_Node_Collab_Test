const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = require('../configs/env.config');
const { UNAUTHORIZED_ACCESS, FORBIDDEN } = require('../constants/http-status-code.constant');
const { JWT_MESSAGES } = require('../constants/messages.constant');
const apiHelper = require('../helpers/api.helper');
const tokenService = require('../services/token.service');
const dbService = require('../services/db.service');
const { DB_MODELS } = require('../constants/models.constant');

const jwtValidatorMiddleware = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verify(bearerToken, JWT_SECRET_KEY, async (err, result) => {
      if (err) {

        return apiHelper.failure(
          res,
          JWT_MESSAGES.UNAUTHORIZED_ACCESS_TOKEN,
          [err],
          UNAUTHORIZED_ACCESS
        );
      } else {
        const searchToken = await dbService.findOne(DB_MODELS.TOKEN, { token: bearerHeader });
        if (searchToken) {
          return apiHelper.failure(res, JWT_MESSAGES.FORBIDDEN_ACCESS, [], FORBIDDEN);
        }
      }
      const user = result;
      req['user'] = user;
      next();
    });
  } else {
    return apiHelper.failure(res, JWT_MESSAGES.FORBIDDEN_ACCESS, [], FORBIDDEN);
  }
};

module.exports = jwtValidatorMiddleware;