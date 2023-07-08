const mongoose = require('mongoose')

// Creating the Likes Model which stores the number of likes/dislikes by individual users

const likesSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        like: { type: Boolean }
    },
    {
        timestamps: true
    }
)

const Likes = mongoose.model('Likes', likesSchema)

module.exports = Likes