const express = require('express')
const router = express.Router()
const postController = require('../controllers/post_controller')
const authMiddleware = require('../middlewares/auth_middleware')

router.get('/', postController.listItems)
router.get('/:itemID', postController.getItem)
router.post('/', authMiddleware, postController.createItem)
router.patch('/:itemID', authMiddleware, postController.updateItem)
router.delete('/:itemID', postController.deleteItem)

module.exports = router