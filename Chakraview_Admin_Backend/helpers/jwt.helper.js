const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } = require('../configs/env.config');

const jwtGenerator = (userData) => {
  const token = jwt.sign({ ...userData }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN, // Set expiration in seconds for 7 days (604800 seconds)
  });

  // const refreshToken = jwt.sign({ ...userData }, JWT_SECRET_KEY, {
  //   expiresIn: JWT_REFRESH_EXPIRES_IN, // Set refresh token expiration according to your configuration
  // });

  return { token };
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decodedToken = jwt.verify(refreshToken, JWT_SECRET_KEY);
    const { exp, iat, ...userData } = decodedToken; // Exclude expiration time and issued at from the new access token
    const newToken = jwt.sign({ ...userData }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRES_IN, // Set expiration in seconds for 7 days (604800 seconds)
    });
    return newToken;
  } catch (error) {
    return null;
  }
};

module.exports = {
  jwtGenerator,
  refreshAccessToken
};
