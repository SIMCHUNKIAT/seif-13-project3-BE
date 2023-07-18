import express from "express";
const router = express.Router()
import reviewController from "../controllers/review.js"
import { verifyToken } from "../middleware/auth.js";

router.post('/', verifyToken, reviewController.createReview)
router.get('/', reviewController.listReviews)

export default router