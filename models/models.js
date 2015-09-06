var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var ActivitySchema = new Schema({
    name: String,
    threshold: Number
});

var Activity = mongoose.model('Activity', ActivitySchema);

var SquadSchema = new Schema({
	location: String,
    month: String,
    meetingtime: String,
    notes: String,
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }
});

var Squad = mongoose.model('Squad', SquadSchema);

var UserSchema = new Schema({
	fullname: String,
    username: String,
    password: String,
    email: String,
    school: String,
    squad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Squad'
    },
    student_age: String,
    student_preference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    },
    mentor_preferred_age: String,
   	mentor_skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }]
});

var User = mongoose.model('User', UserSchema);

module.exports = {
  'Activity': Activity,
  'Squad': Squad,
  'User': User
}