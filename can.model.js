var mongoose = require('mongoose');

var canSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    can_email: String,
    interviewer_email: String,
    can_file_path: String,
    can_resume_path: String
});

var can = mongoose.model('can', canSchema);

module.exports = can;