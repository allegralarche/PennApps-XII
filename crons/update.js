var schedule = require('node-schedule');
/* Database connections */
var dbConfig = require('../db.js');
var mongoose = require('mongoose');
var models = require('../models/models');
var Users = models.User;
var Squads = models.Squad;
var Activities = models.Activity;
mongoose.connect(dbConfig.url);

function monthString() {
	var monthNames = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
	];

	var d = new Date();
	return monthNames[d.getMonth()];
}


// run is reult of schedule.scheduleJob
// cron runs first second of first minute of every hour (once an hour)
var run = schedule.scheduleJob('0 0 * * * *', function() {

	// get all activites
	Activities.find({threshold : {$gte : 0}}, null, null, function (err, as) {

		var numAs = as.length;
		var assignments = [];
		for(var b = 0; b < numAs; b++) {
			assignments[b] = [];
		}
		// loop through activities
		for(a in as) {
			// loop through grade levels
			for(var i = 0; i < 3; i++) {
				var grade = "";
				if(i == 0) {
					grade = "Elementary School";
				}
				else if(i == 1) {
					grade = "Middle School";
				}
				else {
					grade = "High School";
				}

				Users.find({student_preference: a._id, student_age: grade}, null, null, function (err, kids) {
					var numKids = kids.length;
					// if number of interested children meet the threshold then find mentors
					if(numKids >= a.threshold) {
						Users.findOne({mentor_preferred_age: grade, mentor_skills : a._id}, null, null, function (err, mentor) {
							var squ = new Squads({
								location: "Philadelphia, PA",
								month: monthString(),
								meetingtime: "3:00pm",
								notes: "",
								activity: a._id
							});
							squ.save(function (err, s, numAffected) {
								console.log("saved squad");
								for(kid in kids) {
									kid.squad = s._id;
									kid.save(function (err, k, numAffected) {
										// handle errors
										console.log("saved kid");
									});
								}
								mentor.squad = s._id;
								mentor.save(function (err, m, numAffected) {
									console.log("saved mentor");
								});

							});
						}); // for now, assume there will always be a free mentor
						// TODO: need to have way of checking if mentor has already been assigned to squad

					}
				});
			}
		}
	})

  	console.log("update complete!");


});

module.exports = run;