var express = require('express');
var router = express.Router();
var ctrlApp = require('../controllers/index');

/* GET home page. */
router.get('/', ctrlApp.angularApp);

module.exports = router;
