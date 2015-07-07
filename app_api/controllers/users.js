var mongoose    = require('mongoose');
var User        = require('../models/user');
var jwt         = require('jwt-simple');
var moment      = require('moment');
var tokenSecret = process.env.TOKEN_SECRET;

var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.ensureAuthenticated = function (req, res, next) {
  var token, payload;

  if (!req.headers.authorization) {
    return sendJsonResponse(res, 401, {
      message: 'Please make sure your request has an authorization header'
    });
  }
  token   = req.headers.authorization.split(' ')[1];
  payload = null;
  try {
    payload = jwt.decode(token, tokenSecret);
  }
  catch (err) {
    return sendJsonResponse(res, 401, {
      message: err.message
    });
  }

  if (payload.exp <= moment().unix()) {
    return sendJsonResponse(res, 401, {
      message: 'Token has expired'
    });
  }
  req.user = payload.sub;
  next();
};

var createJWT = function (user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, tokenSecret);
};

module.exports.readCurrentUser = function (req, res) {
  User.findbyId(req.user, function (err, user) {
    if (!user) {
      return sendJsonResponse(res, 400, {
        message: 'User not found'
      });
    }
    user.displayName = req.body.displayName || user.displayName;
    user.email       = req.body.email || user.email;
    user.save(function (err) {
      sendJsonResponse(res, 200, user);
    });
  });
};

module.exports.updateCurrentUser = function (req, res) {
  User.findbyId(req.user, function(err, user) {
    if (!user) {
      sendJsonResponse(res, 400, {
        message: 'User not found'
      });
    }
    user.displayName = req.body.displayName || user.displayName;
    user.email = req.body.email || user.email;
    user.save(function (err) {
      sendJsonResponse(res, 200, user);
    });
  });
};

module.exports.login = function (req, res) {
  User.findOne({ email: req.body.email }, '+password', function (err, user) {
    if (!user) {
      return sendJsonResponse(res, 401, {
        message: 'Wrong email and/or password'
      });
    }
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (!isMatch) {
        return sendJsonResponse(res, 401, {
          message: 'Wrong email and/or password'
        });
      }
      res.send({ token: createJWT(user) });
      res.json({message: 'success'});
    });
  });
};

module.exports.signup = function (req, res) {
  var user = new User();
  user.displayName = req.body.displayName;
  user.email = req.body.email;
  user.password = req.body.password;

  user.save(function (err) {
    if (err) {
      if (err.code === 11000) {
        return sendJsonResponse(res, 409, {
          message: 'A user with that username already exists'
        });
      } else {
        return sendJsonResponse(res, 400, {
          message: err
        });
      }
    }
    res.send({token: createJWT(user)});
  });
};


