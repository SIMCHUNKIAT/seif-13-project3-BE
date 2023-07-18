import Joi from "joi"

const validators = {

    createReviewSchema: Joi.object({
        post_id: Joi.string().required(),
        user_id: Joi.string().required(),
        rating: Joi.number().required(),
        comments: Joi.string().min(3),
    })

}

export default validators