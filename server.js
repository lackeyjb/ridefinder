var express     = require('express');
var path        = require('path');
var logger      = require('morgan');
var bodyParser  = require('body-parser');
var compression = require('compression');
var cors        = require('cors');
var port        = process.env.PORT || 3000;

require('dotenv').load();
require('./api/models/db');

var apiRoutes = require('./api/routes/index');
var app = express();

app.use(compression());
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'client'), { maxAge: 2628000000 }));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components'), { maxAge: 2628000000 }));

app.use('/api', apiRoutes);

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(port);
console.log('Server started on port: ' + port);




