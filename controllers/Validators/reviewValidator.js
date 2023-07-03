const Joi = require('joi');

const validators = {

    createReviewSchema: Joi.object({
        post_id: Joi.string().required(),
        user_id: Joi.string().required(),
        rating: Joi.number().required(),
        comment: Joi.string().min(3),
    })

}

module.exports = validators