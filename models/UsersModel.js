const mongoose = require('mongoose')

// Creating the User Model which stores all the user accounts created in the app

const usersSchema = new mongoose.Schema(
    {
        name:   { type: String, required: true },
        email:  { type: String, required: true, unique: true },
        password:   { type: String, required: true }
    },
    {
        timestamps: true
    }
)

const Users = mongoose.model('Users', usersSchema)

module.exports = Users