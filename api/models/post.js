const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    postTitle: { type: String, required: true },
    postText: { type: String, required: true },
    postImage: { type: String }
});

module.exports = mongoose.model('Post', postSchema);
