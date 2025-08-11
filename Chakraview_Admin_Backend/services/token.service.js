// const Token = require('../models/token.model');

// const { TOKEN_MESSAGES } = require('../constants/messages.constant');

// const createToken = async (body) => {
//   try {
//     const tokenInstance = new Token(body);
//     return await tokenInstance.save();
//   } catch (error) {
//     throw Error(TOKEN_MESSAGES.CREATE_ERROR);
//   }
// };

// const getToken = async (query) => {
//   try {
//     return await Token.findOne(query);
//   } catch (error) {
//     throw Error(TOKEN_MESSAGES.GET_ERROR);
//   }
// };

// module.exports = {
//   createToken,
//   getToken,
// };
