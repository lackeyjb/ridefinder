var express   = require('express');
var router    = express.Router();
var usersCtrl = require('../controllers/users');

// login/signup through email and facebook
router.post('/auth/login', usersCtrl.login);
router.post('/auth/signup', usersCtrl.signup);
router.post('/auth/facebook', usersCtrl.fbLogin);

// authentication middleware
//router.use(usersCtrl.isAuthenticated);

// remove facebook from account
router.get('/auth/unlink/:provider', usersCtrl.unlinkProvider);

// current user
router.get('/me', usersCtrl.readCurrentUser);
router.put('/me', usersCtrl.updateCurrentUser);

// jscs:disable
// users
router.get('/users', usersCtrl.users);
router.get('/users/:userId', usersCtrl.user);


module.exports = router;
