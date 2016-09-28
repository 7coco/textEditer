var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var path = require('path');

var textEditer = require('./routes/textEditer');
var newFile = require('./routes/newFile');
var openFile = require('./routes/openFile');

var app = express();

var logger = require('morgan');

var options = {
  host : 'localhost',
  port : 3306,
  user : 'root',
  database : 'text_editer_proto',
  createDatabaseTable : true,
  schema : {
    tableName : 'sessions',
    columnNames : {
      session_id : 'session_id',
      expires : 'expires',
      data : 'data',
    },
  },
};
var sessionStore = new MySQLStore(options);


app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(logger('dev'));
app.use(express.static(__dirname + '/views'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret : 'keyboard cat',
  store : sessionStore,
  resave : false,
  saveUninitialized : false,
  cookie : {
    maxAge : 365 * 24 * 60 * 60 * 1000, // for 365 days
  },
}));

app.use('/textEditer', textEditer);
app.use('/newFile', newFile);
app.use('/openFile', openFile);

app.use((req, res, next) => {
  console.log('my custom middleware!');
  next();
});

app.listen(3001);
console.log('server starting...');
