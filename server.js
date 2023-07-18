import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import reviewRoutes from "./routes/review.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./middleware/cloudinary.js"

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({origin: '*' }))
app.options('*', cors())
app.use(express.static('public'))
app.use(methodOverride('_method'))

/* Local storage for testing */
//app.use("/assets", express.static(path.join(__dirname, "public/assets")));
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/assets");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage });

 
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'GottaGo',
  },
});

const fileParser  = multer({ storage: storage });
 
/* MULTER-CLOUDINARY ROUTES */
app.post("/auth/register",  fileParser.single("picture"), register);
app.post("/posts", verifyToken,  fileParser.single("picture"), createPost);

/* API ENDPOINT ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use('/reviews', reviewRoutes)

/* LISTENER */
const PORT = process.env.PORT || 6001;
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> {
    app.listen(PORT, () => console.log(`GottaGo BE Port: ${PORT} running`))
}).catch((error)=>console.log(`${error} did not connect`))

