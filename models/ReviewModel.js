const mongoose = require('mongoose')

// Creating the Reviews Model which stores the reviews by individual users on each post

const reviewsSchema = new mongoose.Schema(
    {
        comments: { type: String, required: true },
        rating: { type: Number, required: true },
        reviewer: { type: mongoose.Schema.ObjectId, ref: 'Users' },
        post: { type: mongoose.Schema.ObjectId, ref: 'Post' }
    },
    {
        timestamps: true
    }
)

const Reviews = mongoose.model('Reviews', reviewsSchema)

module.exports = Reviews