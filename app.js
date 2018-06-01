// Modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const path = require('path');
const DB = require('./config/database');
const session = require('express-session');
const bcrypt = require('bcryptjs');

// router module
const register = require('./router/register');
const portfolio = require('./router/portfolio');

const app = express();
const port = 3000;

// CORS
app.use(cors());

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session
app.use(session({
  key: 'proj',
  secret: '!@#mysecret!@#',
  resave: false,
  saveUninitialized: true
}));

// static file setting
app.use(express.static(__dirname + '/public'));
app.use('/', express.static(path.join(__dirname, '/public')));

// register Route
app.use('/register', register);
app.use('/portfolio', portfolio);
// MYSQL connect
DB.connect((err) => {
  if (err) throw err;
  console.log('DB connected!');
});

// Server Open
app.listen(port, () => {
  console.log('Server start at ' + port);
});
