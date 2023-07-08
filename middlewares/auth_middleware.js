const jwt = require('jsonwebtoken')

const middleware = (req, res, next) => {
    // check if request is authenticated
    // - look inside header for Authorization key
    // - key not exists -> return 401

    const authzHeaderVal = req.headers.authorization
    if (!authzHeaderVal) {
        res.statusCode = 401
        return res.json({
                msg: 'must have authorization in header'
        })
    }
        
    // - extract JWT token from Authorization key value

    const token = authzHeaderVal.substring(7)

    // - Use JWT to verify the token
    // - return 401 if verification failed
    try {
        jwt.verify(token, process.env.APP_KEY)
    } catch(err) {
        res.statusCode = 401
        return res.json({
            msg: 'failed to verify token'
        })
    }

    // - (Optional) check for token expiry

    next()
}

module.exports = middleware