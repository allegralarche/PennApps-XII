var express = require('express');
var router = express.Router();
var Squad = require('../models/models').Squad;
var User = require('../models/models').User;
var Activity = require('../models/models').Activity;

router.get('/', function(req, res, next) {
	var sname = "";
	var slocation = "";
	var smonth = "";
	var smeetingtime = "";
	var snotes = "";
	if(req.user) {
		var sid = req.user.squad;
		console.log('sid: ' + sid);
		Squad.findById(sid, function(err, result) {
			if(err) {
				console.log(err);
				throw err;
			} else if(result) {
				console.log('aid' + result.activity);
				Activity.findById(result.activity, function(errtwo, resulttwo) {
					if(errtwo) {
						console.log(errtwo);
						throw errtwo;
					} else if(resulttwo){
						sname = resulttwo.name;
						slocation = result.location;
						smonth = result.month;
						smeetingtime = result.meetingtime;
						snotes = result.notes;
						
					}


			
				});
			}
		});


		res.render('pages/mentee-dashboard', {
						sname: sname,
						slocation : slocation,
						smonth : smonth,
						smeetingtime : smeetingtime,
						snotes : snotes
					});

	} else {
		res.render('pages/login');
	}
    
});

module.exports = router;
