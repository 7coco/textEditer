const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');

const textEditer = require('./routes/textEditer');
const newFile = require('./routes/newFile');
const openFile = require('./routes/openFile');

const app = express();

const logger = require('morgan');

const options = {
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
const sessionStore = new MySQLStore(options);


app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '/views')));
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
