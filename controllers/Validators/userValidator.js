const Joi = require('joi')

const validators = {

    register: {

    },

    loginSchema: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })
}

module.exports = validators