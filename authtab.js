var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    admin: {
        type: String
    },
    culture: {
        type: String
    },
    tech: {
        type: String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.addUser = function(newUser, callback) {
    newUser.save(callback);
}

module.exports.getAdmin = function(username, callback) {
    const query = { admin: username }
    User.findOne(query, callback);
}

module.exports.getTech = function(username, callback) {
    const query = { tech: username }
    User.findOne(query, callback);
}

module.exports.getCulture = function(username, callback) {
    const query = { culture: username }
    User.findOne(query, callback);
}