import Review from "../models/Review.js";
import Post from "../models/Post.js";
import validators from "./Validators/reviewValidator.js";
 

const reviewControllers = {

    createReview: async (req, res) => {
        // get data from req body
        const data = req.body

        // validate data
        const validationResult = validators.createReviewSchema.validate(data)
        if (validationResult.error) {
            res.statusCode = 400
            return res.json({
                msg: validationResult.error.details[0].message
            })
        }

        // ensure that menu item exists
        let postItem = null
        try {
            postItem = await Post.findById(data.post_id)
        } catch (err) {
            res.statusCode = 500
            return res.json()
        }

        // TODO: ensure given user id in req matches user id in token
        console.log(res.locals.authUserID)
        console.log(data.user_id)
        if (res.locals.authUserID !== data.user_id) {
            res.statusCode = 401
            return res.json({
                msg: 'not authorised, cannot make review on other\'s behalf'
            })
        }

        // create review
        try {
            await Review.create({
                post: data.post_id,
                reviewer: data.user_id,
                rating: data.rating,
                comments: data.comments ?? '',
            })
        } catch(err) {
            res.statusCode = 500
            return res.json()
        }

        res.statusCode = 201
        res.json()
    },

    listReviews: async (req, res) => {
        // validate query param: post_id
        const postID = req.query.post_id
        if (!postID) {
            res.statusCode = 400
            return res.json({
                msg: "menu item ID not specified"
            })
        }

        // fetch data
        let reviews = []

        try {
            reviews = await Review
                .find({
                    post: postID
                })
                .populate(['post', 'reviewer'])
        } catch(err) {
            res.statusCode = 500
            return res.json()
        }

        res.json(reviews)
    }

}
export default reviewControllers