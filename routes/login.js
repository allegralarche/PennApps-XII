var express = require('express');
var router = express.Router();

/* POST login info. */
router.get('/', function(req, res, next) {
	
  res.render('pages/login');
});

module.exports = router;
