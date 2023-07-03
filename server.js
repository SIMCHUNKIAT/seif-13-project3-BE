require('dotenv').config()
const express = require('express');
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const cors = require('cors');

const app = express();
const port = 3000;

const userRouter = require('./routers/users_router')
const postRouter = require('./routers/post_router')
const reviewRouter = require('./routers/review_router')

app.set('view engine', 'ejs') // FE + BE -> in a single app
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true})) 
app.use(express.json())

app.use(cors({
  origin: '*'
}))

// API endpoint routes
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/reviews', reviewRouter)

// LISTENER
mongoose.connect('mongodb://127.0.0.1:27017/myfavapp')

// mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(() => {
    console.log('DB connected')

    // boot up app
    app.listen(port, () => {
        console.log('My Fav App BE running on port: ', port);
    })
})
.catch(err => {
    console.log('err when connecting: ' + err)
})