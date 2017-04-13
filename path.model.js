var mongoose = require('mongoose');

var pathSchema = mongoose.Schema({
    can_email: String,
    can_img_path: String
});

var path = mongoose.model('path', pathSchema);

module.exports = path;