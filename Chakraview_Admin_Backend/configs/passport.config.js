const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const { AUTH_MESSAGES } = require('../constants/messages.constant');
const { USER_STATUS } = require('../constants/user-status.constant');
const userService = require('../services/user.service');

passport.use(
  new LocalStrategy(
    {
      mobileNumberField: 'mobileNumber',
      passwordField: 'password',
    },
    async (mobileNumber, password, done) => {
      try {
        const user = await userService.getUser({ mobileNumber });
        if (user && Object.keys(user).length) {
          if (!user.validPassword(password)) {
            return done(null, false, {
              errors: AUTH_MESSAGES.LOGIN_ERROR,
            });
          }

          if (user.status === USER_STATUS.IN_ACTIVE || user.status === USER_STATUS.DELETED) {
            return done(null, false, {
              errors: AUTH_MESSAGES.ACCOUNT_DEACTIVED,
            });
          }
          return done(null, user);
        }
        return done(null, false, {
          errors: AUTH_MESSAGES.LOGIN_ERROR,
        });
      } catch (error) {
        throw error;
      }
    }
  )
);

module.exports = passport;
