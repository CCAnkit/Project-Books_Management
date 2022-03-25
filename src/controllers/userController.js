const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel.js");


// -----------validation-----------------------------------------------------------------------------------
const isValidValue = function(value){   //it should not be like undefined or null.
    if (typeof value === 'undefined' || value === null) return false   //if the value is undefined or null it will return false.
    if (typeof value === 'string' && value.trim().length === 0) return false   //if the value is string & length is 0 it will return false.
    return true
}
    
const isValidDetails = function(details){   
    return Object.keys(details).length > 0
}

// -----------CreateUser-----------------------------------------------------------------------------------
const createUser = async function(req, res) {
    try{
        const user = req.body
        if(!isValidDetails(user)){
            res.status(400).send({status:false, msg:"Please provide the User details"})  //Validate the value that is provided by the Client.
        }
        const {title, name, phone, email, password} = user
        if (!isValidValue(title)){
            return res.status(400).send({status:false, msg:"Please provide the Title"})   //title is mandory 
        }
        if (!isValidValue(name)){
            return res.status(400).send({status:false, msg:"Please provide the Name"})   //name is mandory 
        }

        if (!isValidValue(phone)){
            return res.status(400).send({status:false, msg:"Please provide phone number"})    //phone is mandory
        }
        // if(!/^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(phone)){
        //     return res.status(400).send({status:false,msg:"Please provide valid phone number"})    //Regex for checking the valid phone format
        // }
        const phoneUsed = await userModel.findOne({phone})   //phone is unique
        if(phoneUsed){
            return res.status(400).send({status:false, msg:`${phone} is already exists`})   //checking the phone number is already exist or not.
        }    
        if (!isValidValue(email)){
            return res.status(400).send({status:false, msg:"Please provide Email Address"})   //email is mandory
        }
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            return res.status(400).send({status:false,msg:"Please provide valid Email Address"})    //Regex for checking the valid email format 
        }
        const emailUsed = await userModel.findOne({email})  //unique is email
        if(emailUsed){
            return res.status(400).send({status:false, msg:`${email} is already exists`})   //checking the email address is already exist or not.
        }
        if (!isValidValue(password)){
            return res.status(400).send({status:false, msg:"Please provide the Password"})   //password is mandory 
        }
        if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/.test(password)){
            return res.status(400).send({status:false,msg:"Please provide valid Password"})    //Regex for checking the valid password format 
        }
        const data = await userModel.create(user)  //creating the User details
            res.status(201).send({status: true, msg : "User details saved successfully", data: data})
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}


// -------------UserLogin-----------forAuthentication----------------------------------------------------------------------------
const login = async function(req, res) {
    try{
        let login = req.body
        if (!isValidDetails(login)){
            return res.status(400).send({ status: false, msg: "Please provide login Details" })
        }
        const {email, password} = login
        if (!isValidValue(email)){
            return res.status(400).send({status:false, msg:"Please provide the Email Address"})   //Validate the value that is provided by the Client.
        }
        if (!isValidValue(password)){
            return res.status(400).send({status:false, msg:"Please provide the password"})  //checks that the password is correct or not.
        }
        let isValidUser = await userModel.findOne({email, password});  //finding the email/password in the authors.
        if (!isValidUser){
        return res.status(401).send({status: false, msg: "Email or Password is not correct, Please check your credentials again.",})    
        }  
        let token = jwt.sign(   //creating the token for the authentication.
            {
                _id : isValidUser._id   //payload(details that we saved in this token)
            },
                "Project-Books", { expiresIn: '30000mins' });  //secret key
        res.setHeader("x-api-key", token);  //setting token to header
        res.status(200).send({ status: true, message: `User logged in successfully`, data: { token } });  
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}

module.exports.createUser = createUser;
module.exports.login = login;