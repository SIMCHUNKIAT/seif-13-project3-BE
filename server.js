require('dotenv').config()
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cors = require('cors');
const ejs = require('ejs');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const posts = require('./models/posts');

const app = express();
const port = 3000;

const userRouter = require('./routers/users_router')
const postRouter = require('./routers/post_router')
const reviewRouter = require('./routers/review_router')

// setting up ejs views
app.set('view engine', 'ejs') // FE + BE -> in a single app

app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true})) 
app.use(express.json())

app.use(cors({
  origin: '*'
}))

// For uploading of files into cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'GottaGo',
    },
});

const fileParser = multer({ storage: storage });

// multer-cloudinary routes
app.post('/api/media/upload', fileParser.single('media_file'), (req, res) => {
    if (!req.file) {
        res.statusCode = 500
        return res.json({
            msg: 'failed to upload file'
        })
    }

    res.json(req.file)
})

// ejs routes
// main page
app.get('/', (req, res) => {
    res.render('./app/main', { posts: posts });
});

// individual posts page
app.get('/posts/:id', (req, res) => {
    const id = req.params.id
    res.render('./app/show', { posts: posts, index: id });
});

// login page WIP
app.get('/api/user/login', (req, res) => {
    res.send('login page')
})

// Creation of NEW review page
app.get('/reviews', (req, res) => {
    res.render('.app/newReview')
})

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
        console.log('GottaGo BE running on port: ', port);
    })
})
.catch(err => {
    console.log('err when connecting: ' + err)
})