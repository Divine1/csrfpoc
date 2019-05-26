"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = require("body-parser");

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _hbs = _interopRequireDefault(require("hbs"));

var _csurf = _interopRequireDefault(require("csurf"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _lusca = _interopRequireDefault(require("lusca"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
app.set("view engine", "hbs");
/*
const csrfMiddleware = csurf({
    cookie: true
});
app.use(cookieParser());
app.use(csrfMiddleware);
*/

app.use((0, _bodyParser.json)());
app.use((0, _bodyParser.urlencoded)({
  extended: true
}));
app.use((0, _morgan.default)('dev'));
var whitelist = ['http://localhost:3001', "http://192.168.0.3:3001"];

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;

  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      origin: true // reflect (enable) the requested origin in the CORS response

    };
  } else {
    corsOptions = {
      origin: false // disable CORS for this request

    };
  }

  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use((0, _expressSession.default)({
  secret: 'abc',
  resave: true,
  saveUninitialized: true
})); //app.use(cors(corsOptionsDelegate))

app.use((0, _cors.default)());
app.use(_lusca.default.csrf());
app.use(_lusca.default.referrerPolicy('no-referrer'));
app.get('/page', (req, res) => {
  //console.log("req-- ",req.csrfToken())
  console.log("__dirname ", __dirname);
  res.render("rest.hbs");
});
app.get('/', (req, res) => {
  console.log("req-- ", req.csrfToken());
  res.send({
    message: "hello index"
  });
});
app.get('/csrf', (req, res) => {
  console.log("in /csrf route");
  let data = "";

  try {
    data = req.csrfToken();
  } catch (err) {}

  res.send({
    "csrfToken": data
  });
});
app.get('/index', (req, res) => {
  console.log("in /index route");
  res.render("index.hbs", {
    csrfToken: req.csrfToken()
  });
});
app.post('/store', (req, res) => {
  console.log("req--- ", req.body);
  res.send({
    data: req.body.firstname + " - " + Date.now()
  });
});
app.listen(3000, () => {
  console.log("server started at 3000");
});