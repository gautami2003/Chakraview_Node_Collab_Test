const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const app = express();

const allowedOrigins = [
  'https://admin-nextapp.chakraview.co.in',
  'http://localhost:3000'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: false
}));

// const allowedOrigins = [
//   'https://admin-nextapp.chakraview.co.in'
// ];
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true, // ← THIS IS IMPORTANT if using cookies or Authorization headers
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));
// app.options('*', cors());

// create express server
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "15mb" }));

process.env.TZ = "Asia/Kolkata";
// Create a custom morgan token to log request body
morgan.token("parameters", (req) => {
  if (req.method === "GET") {
    return JSON.stringify(req.query);
  } else {
    return JSON.stringify(req.body);
  }
});

morgan.token("headers", (req) => {
  return JSON.stringify(req.headers);
});

// use middlewares
app.use(compression());
// const allowedOrigins = ['https://admin-nextapp.chakraview.co.in'];
// app.use(cors({
//   origin: allowedOrigins,
// }));
// app.use(morgan(':method :url STATUS=:status PAYLOAD=:parameters HEADERS=:headers'));
// app.use(express.json());

// local imports
const { PORT } = require("./configs/env.config");
const { PUBLIC_DIR } = require("./constants/file-directories.constant");
const { NOT_FOUND } = require("./constants/http-status-code.constant");
const { COMMON_MESSAGES } = require("./constants/messages.constant");
const apiHelper = require("./helpers/api.helper");
const { engine } = require("express-handlebars");

//template engine setup (express-handlebar)
app.engine("handlebars", engine());
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

//serving static files without using public folder
app.use(express.static(PUBLIC_DIR));

// database connection
require("./configs/db-connection.config");

// import all the models
require("./models/index.model");

// import all the routes
app.use(require("./routes/index.route"));

// import rabbitMQ listeners
require("./utils/rabbitmq/index");

// import passport configuration
require("./configs/passport.config");

// import index script
require("./scripts/index.script");

app.get("/", (req, res) => {
  res.send("Server is up and running!!");
});

// catch 404 route and pass it to error handler
app.use((req, res, next) => {
  const error = new Error(COMMON_MESSAGES.ROUTE_NOT_EXISTS);
  error.status = NOT_FOUND;
  next(error);
});

// error handlers
app.use((err, req, res, next) => {
  apiHelper.failure(res, err.message, [], NOT_FOUND);
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});

