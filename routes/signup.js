var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/college', function(req, res, next) {
  res.render('pages/signup-college');
});

router.get('/student', function(req, res, next) {
  res.render('pages/signup-student');
});

module.exports = router;
