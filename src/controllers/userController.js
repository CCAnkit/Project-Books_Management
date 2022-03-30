const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel.js");
const validator = require('../validators/validator.js');

// -----------CreateUser-----------------------------------------------------------------------------------
const createUser = async function(req, res) {
    try{
        const user = req.body
        if(!validator.isValidDetails(user)){
            res.status(400).send({status:false, msg:"Please provide the User details"})  //Validate the value that is provided by the Client.
        }
        const {title, name, phone, email, password} = user   
        if (!validator.isValidValue(title)){
            return res.status(400).send({status:false, msg:"Please provide the Title"})   //title is mandory 
        }
        if (!validator.isValidTitle(title)){
            return res.status(400).send({status:false, msg:"Please should be Mr || Mrs || Miss"})   //Enum is mandory 
        }
        if (!validator.isValidValue(name)){
            return res.status(400).send({status:false, msg:"Please provide the Name"})   //name is mandory 
        }
        if (!validator.isValidValue(phone)){
            return res.status(400).send({status:false, msg:"Please provide phone number"})    //phone is mandory
        }
        if(!/^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(phone)){
            return res.status(400).send({status:false,msg:"Please provide valid phone number"})    //Regex for checking the valid phone format
        }
        const phoneUsed = await userModel.findOne({phone})   //phone is unique
        if(phoneUsed){
            return res.status(400).send({status:false, msg:`${phone} is already exists`})   //checking the phone number is already exist or not.
        }    
        if (!validator.isValidValue(email)){
            return res.status(400).send({status:false, msg:"Please provide Email Address"})   //email is mandory
        }
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            return res.status(400).send({status:false,msg:"Please provide valid Email Address"})    //Regex for checking the valid email format 
        }
        const emailUsed = await userModel.findOne({email})    //unique is email
        if(emailUsed){
            return res.status(400).send({status:false, msg:`${email} is already exists`})   //checking the email address is already exist or not.
        }
        if (!validator.isValidValue(password)){
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
        const login = req.body
        const {email, password} = login
        
        if (!validator.isValidDetails(login)){
            return res.status(400).send({ status: false, msg: "Please provide the login Details" })   //validating the parameters of body
        }
        if (!validator.isValidValue(email)){
            return res.status(400).send({status:false, msg:"Please provide the Email Address"})   //email is mandatory
        }
        if (!validator.isValidValue(password)){
            return res.status(400).send({status:false, msg:"Please provide the password"})  //password is mandatory
        }
        const User = await userModel.findOne({email, password});   //validating the email/password in the userModel.
        if (!isValidUser){
        return res.status(401).send({status: false, msg: "Email or Password is not correct, Please check your credentials again.",})    
        }  
        const token = jwt.sign(   //creating the token for the authentication.
            {
                userId : User._id   //payload(details that we saved in this token)
            },
                "Project-Books", { expiresIn: '30000mins' });  //secret key with the expiry
        res.setHeader("x-api-key", token);  //setting token in header
        res.status(200).send({ status: true, message: `User logged in successfully`, data: { token } });  
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}

module.exports = {
    createUser, 
    login
}
