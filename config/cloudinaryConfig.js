require('dotenv').config()
import { config, uploader } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
const cloudinary = require('cloudinary').v2;

const cloudinaryConfig = () => config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});



export { cloudinaryConfig, uploader };