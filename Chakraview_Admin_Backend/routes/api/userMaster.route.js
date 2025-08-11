const express = require('express');
const router = express.Router();

const {
  BODY,
  PARAMS,
  QUERY,
} = require('../../constants/request-properties.constant');
const { ADMIN } = require('../../constants/role.constant');
const {
  getUser,
  updateUser
} = require('../../controllers/user.controller');
const {
  updateUserSchema,
} = require("../../validators/user.validator");
const requestValidatorMiddleware = require('../../middlewares/request-validator.middleware');
const jwtValidatorMiddleware = require('../../middlewares/jwt-validator.middleware');

router.get(
  '/',
  jwtValidatorMiddleware,
  getUser
);

router.post(
  '/',
  [jwtValidatorMiddleware, requestValidatorMiddleware([updateUserSchema], [BODY])],
  updateUser
);


module.exports = router;