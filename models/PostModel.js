const mongoose = require('mongoose')

// Creating the Post Model which stores the posts by individual users

const postSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String },
    },
    {
        timestamps: true
    }
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post