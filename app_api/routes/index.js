var express   = require('express');
var router    = express.Router();
var usersCtrl = require('../controllers/users');

// users
router.post('/auth/login', usersCtrl.login);
router.post('/auth/signup', usersCtrl.signup);
router.get('/me', usersCtrl.ensureAuthenticated, usersCtrl.readCurrentUser);
router.put('/me', usersCtrl.ensureAuthenticated, usersCtrl.updateCurrentUser);

module.exports = router;
