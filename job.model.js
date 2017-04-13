var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    job_description: String,
    question: String,
    answer: String
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;