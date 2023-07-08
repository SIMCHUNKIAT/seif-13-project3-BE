const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/review_controller')
const authMiddleware = require('../middlewares/auth_middleware')

router.post('/', authMiddleware, reviewController.createReview)
router.get('/', reviewController.listReviews)

module.exports = router