import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import cloudinary from "../middleware/cloudinary.js";
import Joi from "joi";
import authValidator from "./Validators/authValidator.js"

/* REGISTER USER */
export const register = async (req, res) => {
 
  const validationResult = authValidator.registerSchema.validate(req.body, { abortEarly: false })
  if (validationResult.error) {
      res.statusCode = 400
      return res.json({
          msg: validationResult.error.details[0].message
      })
  }

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    let pictureUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        allowed_formats: ['png', 'jpg', 'jpeg']
      });
      pictureUrl = result.secure_url;
      console.log (result )
    }
   
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt); //using default salt rounds

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath: pictureUrl,
      friends,
      location,
      viewedProfile: Math.floor(Math.random() * 100), //generate random views for now as placeholder
      impressions: Math.floor(Math.random() * 100), //generate random post stats for now as placeholder
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ msg: 'failed to upload file' });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {

  const validationResult = authValidator.loginSchema.validate(req.body, { abortEarly: false })
  if (validationResult.error) {
      res.statusCode = 400
      return res.json({
          msg: validationResult.error.details[0].message
      })
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(401).json({ msg: "login failed. Pls check login details" });

    const validLogin = await bcrypt.compare(password, user.password);
    if (!validLogin) return res.status(401).json({ msg: "login failed. Pls check login details" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{ 
      expiresIn: "10 days",
      audience: "FE",
      issuer: "BE",
      subject: user._id.toString(),});
      //console.log(user._id.toString())

    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
