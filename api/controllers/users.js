var mongoose    = require('mongoose');
var User        = require('../models/user');
var jwt         = require('jwt-simple');
var moment      = require('moment');
var qs          = require('querystring');
var request     = require('request');
var tokenSecret = process.env.TOKEN_SECRET;
var fbSecret    = process.env.FACEBOOK_SECRET;

var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

var createJWT = function (user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, tokenSecret);
};

module.exports.isAuthenticated = function (req, res, next) {
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

module.exports.readCurrentUser = function (req, res) {
  User.findById(req.user, function (err, user) {
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
  User.findById(req.user, function(err, user) {
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
    });
  });
};

module.exports.signup = function (req, res) {
  var user         = new User();
  user.displayName = req.body.displayName;
  user.email       = req.body.email;
  user.password    = req.body.password;

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

module.exports.fbLogin = function(req, res) {

  var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
  var graphApiUrl    = 'https://graph.facebook.com/v2.3/me';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Exchange authorization code for access token.
  request.get({
    url: accessTokenUrl,
    qs: params,
    json: true
  }, function(err, response, accessToken) {

    if (response.statusCode !== 200) {
      return sendJsonResponse(res, 500, {
        message: accessToken.error.message
      });
    }

    // Retrieve profile information about the current user.
    request.get({
      url: graphApiUrl,
      qs: accessToken,
      json: true
    }, function(err, response, profile) {

      if (response.statusCode !== 200) {
        return sendJsonResponse(res, 500, {
          message: profile.error.message
        });
      }
      if (req.headers.authorization) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return sendJsonResponse(res, 409, {
              message: 'There is already a Facebook account that belongs to you'
            });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook    = profile.id;
            user.displayName = user.displayName || profile.name;
            user.picture     = user.picture || ('https://graph.facebook.com/v2.3/' +
                                                profile.id + '/picture?type=large');
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.facebook    = profile.id;
          user.picture     = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.displayName = profile.name;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
};

module.exports.unlinkProvider = function (req, res) {
  var provider = req.params.provider;
  if (provider !== 'facebook') {
    return sendJsonResponse(res, 400, {
      message: 'Unknown provider'
    });
  }

  User.findById(req.user, function (err, user) {
    if (!user) {
      return sendJsonResponse(res, 400, {
        message: 'User not found'
      });
    }
    user[provider] = undefined;
    user.save(function () {
      res.status(200).end();
    });
  });
};

module.exports.users = function (req, res) {
  User.find(function (err, users) {
    if (err) {
      sendJsonResponse(res, 400, err);
    }
    sendJsonResponse(res, 200, users);
  });
};

module.exports.user = function (req, res) {
  User.findById(req.params.userId, function (err, user) {
    if (err) {
      sendJsonResponse(res, 400, err);
    }
    sendJsonResponse(res, 200, user);
  });
};
