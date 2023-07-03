const { validate } = require('../models/UsersModel')
const usersModel = require('../models/UsersModel')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const userValidator = require('./Validators/userValidator')

const usersController = {

    register: async (req, res) => {
        const data = req.body

        const validationSchema = Joi.object({
            name: Joi.string().min(3).max(100).required(),
            email: Joi.string().min(3).max(30).required(),
            password: Joi.string().required(),
        })

        const validationResult = validationSchema.validate(data, { abortEarly: false })
        if (validationResult.error) {
            res.statusCode = 400
            return res.json({
                msg: validationResult.error.details[0].message
            })
        }

        const hash = await bcrypt.hash(data.password, 10)

        try {
            await usersModel.create({
                name: data.name,
                email: data.email,
                password: hash,
            })
        } catch (err) {
            res.statusCode = 500
            return res.json({
                msg: "failed to create user"
            })
        }
        res.json()
    },

    login: async (req, res) => {
        // get login data from request body
        const data = req.body
    
        // validate the data
        const validationSchema = Joi.object({
          //  name: Joi.string().min(3).max(100).required(),
            email: Joi.string().min(3).required(),
            password: Joi.string().required(),
        })

        const validationResult = validationSchema.validate(data)
        if (validationResult.error) {
            res.statusCode = 400
            
            return res.json({
                msg: validationResult.error.details[0].message
            })
        }

        // find if user exists by the username (email)

        // if not exist, return log in error statusCode 400
        let user = null

        try {
            user = await usersModel.findOne({ email: data.email })
        } catch (err) {
            res.statusCode = 500
            return res.json({
                msg: "error occured when fetching user"
            })
        }

        
        if (!user) {
            res.statusCode = 401
            return res.json({
                msg: "login failed. Pls check login details"
            })
        }

        // use bcrypt to compare given password against database record
        const validLogin = await bcrypt.compare(data.password, user.password)
        if (!validLogin) {
            res.statusCode = 401
            return res.json({
                msg: "login failed, pls check login details"
            })
        }

        // if fail, return status 401 (unauthorised)
        // generate JWT using external library
        const token = JWT.sign({
            name: user.name,
            email: user.email,
        }, process.env.APP_KEY)

        // return response with JWT
        res.json({
            msg: "login successful",
            token: token,
        })

        // res.send('logged in')
    },
}

module.exports = usersController