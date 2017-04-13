var mongoose = require('mongoose');

var ranSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    dob: String,
    email: String,
    primarylanguage: String,
    competency: String,
    q0: String,
    q1: String,
    q2: String,
    q3: String,
    q4: String,
    q5: String,
    skill1: String,
    skill2: String,
    skill3: String,
    skill4: String,
    skill5: String,
    comskills: String,
    slct: String

});

var Ran = mongoose.model('Ran', ranSchema);

module.exports = Ran;