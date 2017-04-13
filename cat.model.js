var mongoose = require('mongoose');

var catSchema = mongoose.Schema({
    job_description: String,
    question: String,
    answer: String
});

var Cat = mongoose.model('Cat', catSchema);

module.exports = Cat;