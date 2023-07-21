const PostModel = require('../models/PostModel')

const PostControllers = {

    listItems: async (req, res) => {
        const items = await postModel.find()
        res.json(items)
    },

    getItem: async (req, res) => {
        const itemID = req.params.itemID
        let postItem = null

        try {
            // use model to find by id
            postItem = await postModel.findById(itemID)
        } catch(err) {
            // if any error -> return response 500
            res.statusCode = 500
            return res.json()
        }

        // if not exists -> return response 404
        if (!postItem) {
            console.log('does not exisxts')
            res.statusCode = 404
            return res.json()
        }

        // return json response of the fetched data
        return res.json(postItem)
    },

    createItem: async (req, res) => {
        // get the data from request
        const data = req.body

        // TODO: data validation

        // let imageData = data.image
        // if (!imageData) {
        //     imageData = ''
        // }

        // insert to DB using model
        const result = await PostModel.create({
            name: data.name,
            description: data.description,
            image: data.image ?? ''
        })

        res.statusCode = 201
        res.json({
            msg: "Created successfully"
        })
    },

    updateItem: async (req, res) => {
        // get the data from the req body
        const data = req.body

        console.log(req.params.itemID)

        // TODO: validation

        // try get the item from DB, if not exists, return 404 not found response
        let item = null // -> will evaluate to a falsy value

        try {
            item = await postModel.findById(req.params.itemID)
        } catch(err) {
            console.log(err)
            res.statusCode = 500
            return res.json()
        }

        if (!item) {
            res.statusCode = 404
            return res.json()
        }

        console.log(item)

        // if image is given to be updated, then update, else no change
        let image = item.image
        if (data.image) {
            image = data.image
        }

        console.log(image)

        // use menu item model to update into database
        try {
            await postModel.updateOne(
                {
                    _id: req.params.itemID
                },
                {
                    name: data.name,
                    description: data.description,
                    image: image
                }
            )
        } catch(err) {
            console.log(err)
            res.statusCode = 500
            return res.json()
        }

        console.log('updated')
        
        res.json()
    },

    deleteItem: async (req, res) => {
        // get item ID from req, and perform validations
        let itemID = req.params.itemID

        // ensure data is present: number is within array data range

        // remove item from array 
        await postModel.deleteOne({ _id: itemID })

        res.json()
    },

}

module.exports = PostControllers