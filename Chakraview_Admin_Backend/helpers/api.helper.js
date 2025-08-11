const { SUCCESS, INTERNAL_SERVER_ERROR, } = require('../constants/http-status-code.constant');

const success = (res, message = '', data = {}, meta = {}, success = true, statusCode = SUCCESS) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    meta
  });
};

const failure = (res, message = '', errors = [], statusCode = INTERNAL_SERVER_ERROR, data = {}, meta = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data,
    meta,
    errors,
  });
};

module.exports = {
  success,
  failure,
};