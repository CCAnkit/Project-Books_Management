const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {        //authentication & authorization for the authorized user
    try {
        const token = req.headers['x-api-key']    //header

        if(!token) {        //validating the token is present in headers or not.
            return res.status(400).send({status: false, message: `Token must be present`})   
        } 

        const decodeToken = await jwt.verify(token, 'Project-Books')    //verify the secret key
        if(!decodeToken) {
            return res.status(403).send({status: false, message: `You are not autherised to access.`})
        }
        req.userId = decodeToken.userId;     //decode token by checking the userId

        next()      //if token is present & for the same user then move to the next
    } 
    catch (error) {
        console.error(`Error! ${error.message}`)
        res.status(500).send({status: false, message: error.message})
    }
}

module.exports.userAuth = userAuth