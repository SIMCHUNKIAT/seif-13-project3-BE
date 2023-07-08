require('dotenv').config('../../.env')
const mongoose = require('mongoose')
const PostModel = require('../PostModel')

// import data to be seeded in db
const postRaw = require('../posts') // -> array of post objects

// make a connection to db
// mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
mongoose.connect('mongodb://127.0.0.1:27017/myfavapp')
    .then(async () => {
        console.log('seeding db')
        
        // insert into database using created model
        const seedResult = await PostModel.insertMany(postRaw)

        console.log(seedResult)

        mongoose.disconnect()
    })
    .catch(err => {
        console.log('failed to seed the data')
    })
