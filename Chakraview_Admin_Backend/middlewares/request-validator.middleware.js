const apiHelper = require("../helpers/api.helper");
const { COMMON_MESSAGES } = require("../constants/messages.constant");
const {
  UNPROCESSABLE_ENTITY,
} = require("../constants/http-status-code.constant");

const requestValidatorMiddleware = (schemas = [], properties = []) => {
  return (req, res, next) => {
    if (schemas.length === properties.length) {
      const data = req
      for (const key in data.body) {
        if (typeof data.body[key] === "string") {
          req.body[key] = data.body[key].trim();
        }
      }
      const errors = [];
      for (const [index, schema] of schemas.entries()) {
        const property = properties[index];
        const { error } = schema.validate(req[property], { abortEarly: false });
        if (error) {
          const { details } = error;
          errors.push(...details);
        }
      }

      if (errors.length) {
        return apiHelper.failure(
          res,
          COMMON_MESSAGES.VALIDATION_ERROR,
          errors,
          UNPROCESSABLE_ENTITY
        );
      }
      next();
    } else {
      return apiHelper.failure(res, COMMON_MESSAGES.UNKNOWN_ERROR);
    }
  };
};

module.exports = requestValidatorMiddleware;
