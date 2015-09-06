var express = require('express');
var router = express.Router();
var mw = require('../auth/middleware');

router.get('/', function(req, res, next) {
	mw.ensureAuthenticated(req, res, next);
    res.render('pages/mentee-dashboard');
});

module.exports = router;
