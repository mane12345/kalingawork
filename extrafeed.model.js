var mongoose = require('mongoose');

var extrafeedSchema = mongoose.Schema({
    questions: String,
    answers: String
});

var Extrafeed = mongoose.model('Extrafeed', extrafeedSchema);

module.exports = Extrafeed;