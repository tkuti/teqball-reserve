require("dotenv").config()
var jwt = require('jsonwebtoken');

 
 function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1]

        jwt.verify(bearerToken, process.env.JWT_SECRET, async (err, authData) => {
            if (err) {
                res.status(403).json({
                    msg: 'Forbidden',
                })
            } else {
                next()
            }
        })

    } else {
        res.status(403).json({
            msg: 'Forbidden',
        })
    }
}

module.exports = verifyToken