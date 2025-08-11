// const createSession = async (req, res) => {
//   try {
//     const { IMEINumber, OSType, OSVersion, Model, Brand } = req.query;

//     let max = 9999999,
//       min = 1000000;
//     const num = Math.floor(Math.random() * (max - min)) + min;
//     const curDateTime = moment();
//     const formattedCurDateTime = curDateTime.format("YYYY-MM-DD HH:mm:ss");
//     const newDateTime = curDateTime.add(30, "days");
//     const formattedDateTime = newDateTime.format("YYYY-MM-DD HH:mm:ss");

//     // let sqlSessionPrevious = await DB_MODELS.MOBILE_SESSIONS.findAll({
//     //     where: {
//     // imei: {
//     //     [Sequelize.Op.like]: `%${IMEINumber}%`
//     // }
//     //     },
//     //     attributes: ['msid'],
//     //     limit: 1
//     // })

//     let sqlSessionPrevious = await dbService.findAll(
//       DB_MODELS.MOBILE_SESSIONS,
//       {
//         imei: {
//           [Sequelize.Op.like]: `%${IMEINumber}%`,
//         },
//       },
//       ["msid"],
//       true,
//       [],
//       [],
//       null,
//       null,
//       1
//     );

//     const count = sqlSessionPrevious.length > 0 ? "Y" : "N";

//     await DB_MODELS.MOBILE_SESSIONS.create({
//       imei: IMEINumber,
//       ostype: OSType,
//       osversion: OSVersion,
//       model: Model,
//       brand: Brand,
//       status: "1",
//       DateTime: curDateTime,
//       ValidUpto: formattedDateTime,
//       expdt: "",
//       sessionid: num,
//       sno: "",
//       pushtoken: "",
//       lastactivity: formattedCurDateTime,
//       nowdt: "",
//     });

//     const json = {
//       Message: "Ok",
//       SessionId: num,
//       code: "200",
//       isReturning: count,
//       ValidUpto: formattedDateTime,
//     };

//     return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, json);
//   } catch (error) {
//     await logError(req, res, "parentcontroller", "createSession", error, {});
//     return apiHelper.failure(res, COMMON_MESSAGES.SOME_ERROR, error.message);
//   }
// };

// const regenerateSession = async (req, res) => {
//   try {
//     const { SessionNo, IMEINumber, OSType, OSVersion, Model, Brand } =
//       req.query;

//     let max = 9999999,
//       min = 1000000;
//     const num = Math.floor(Math.random() * (max - min)) + min;
//     const curDateTime = moment();
//     const formattedCurDateTime = curDateTime.format("YYYY-MM-DD HH:mm:ss");
//     const newDateTime = curDateTime.add(30, "days");
//     const formattedDateTime = newDateTime.format("YYYY-MM-DD HH:mm:ss");

//     await DB_MODELS.MOBILE_SESSIONS.create({
//       imei: IMEINumber,
//       ostype: OSType,
//       osversion: OSVersion,
//       model: Model,
//       brand: Brand,
//       status: "1",
//       DateTime: curDateTime,
//       ValidUpto: formattedDateTime,
//       expdt: "",
//       sessionid: num,
//       sno: "",
//       pushtoken: "",
//       lastactivity: formattedCurDateTime,
//       nowdt: "",
//     });

//     // await DB_MODELS.MOBILE_SESSIONS.update(
//     //     { status: '0', lastactivity: formattedCurDateTime },
//     //     { where: { sessionid: num } }
//     // )

//     await dbService.update(
//       DB_MODELS.MOBILE_SESSIONS,
//       { status: "0", lastactivity: formattedCurDateTime },
//       { sessionid: num }
//     );

//     const json = {
//       Message: "Ok",
//       SessionId: num,
//       code: "200",
//       isReturning: "Y",
//       ValidUpto: formattedDateTime,
//     };

//     return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, json);
//   } catch (error) {
//     console.error(error);
//     return apiHelper.failure(res, COMMON_MESSAGES.NO_DATA_FOUND, error.message);
//   }
// };

// const updatePushToken = async (req, res) => {
//   try {
//     const { sno, Token } = req.query;
//     await dbService.update(
//       DB_MODELS.MOBILE_SESSIONS,
//       { pushtoken: Token },
//       { sessionid: sno }
//     );

//     const json = {
//       Message: "Ok",
//       code: "200",
//     };
//     return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, json);
//   } catch (error) {
//     console.error(error);
//     return apiHelper.failure(res, COMMON_MESSAGES.NO_DATA_FOUND, error.message);
//   }
// };

// const updateImeiToken = async (req, res) => {
//   try {
//     const { sno, Token } = req.query;

//     await dbService.update(
//       DB_MODELS.MOBILE_SESSIONS,
//       { imei: Token },
//       { sessionid: sno }
//     );

//     const json = {
//       Message: "Ok",
//       code: "200",
//     };

//     return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, json);
//   } catch (error) {
//     console.error(error);
//     return apiHelper.failure(res, COMMON_MESSAGES.NO_DATA_FOUND, error.message);
//   }
// };

// const updateLoginInfo = async (req, res) => {
//   try {
//     const { sno, Token } = req.query;

//     await dbService.update(
//       DB_MODELS.MOBILE_SESSIONS,
//       { loginnumber: Token },
//       { sessionid: sno }
//     );

//     const json = {
//       Message: "Ok",
//       code: "200",
//     };

//     return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, json);
//   } catch (error) {
//     console.error(error);
//     return apiHelper.failure(res, COMMON_MESSAGES.NO_DATA_FOUND, error.message);
//   }
// };

// const destroySession = async (req, res) => {
//   try {
//     const { sno } = req.query;
//     const curDateTime = moment();
//     const formattedCurDateTime = curDateTime.format("YYYY-MM-DD HH:mm:ss");

//     await dbService.update(
//       DB_MODELS.MOBILE_SESSIONS,
//       { status: "0", lastactivity: formattedCurDateTime },
//       { sessionid: sno }
//     );
//     const json = {
//       Message: "Ok",
//       code: "200",
//     };

//     return apiHelper.success(res, COMMON_MESSAGES.DATA_RETRIEVED, {});
//   } catch (error) {
//     console.error(error);
//     return apiHelper.failure(res, COMMON_MESSAGES.NO_DATA_FOUND, error.message);
//   }
// };