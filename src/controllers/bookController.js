const bookModel = require("../models/bookModel.js");
const userModel = require("../models/userModel.js");
const moment = require("moment");


// -----------validation-----------------------------------------------------------------------------------
const isValidValue = function(value){   //it should not be like undefined or null.
    if (typeof value === 'undefined' || value === null) return false   //if the value is undefined or null it will return false.
    if (typeof value === 'string' && value.trim().length === 0) return false   //if the value is string & length is 0 it will return false.
    return true
}
    
const isValidDetails = function(details){   
    return Object.keys(details).length > 0
}


// -----------CreateBooks-----------------------------------------------------------------------------------
const createBook = async function(req, res) {
    try{
        const book = req.body
        if(!isValidDetails(book)){
            res.status(400).send({status:false, msg:"Please provide the Book details"})  //Validate the value that is provided by the Client.
        }
        const {title, excerpt, userId, ISBN, category, subcategory} = book
        if (!isValidValue(title)){
            return res.status(400).send({status:false, msg:"Please provide the Title"})   //Title is mandory 
        }
        const isDuplicateTitle = await bookModel.findOne({title: title})
        if (isDuplicateTitle){
            return res.status(400).send({status:true, msg:"Title already exists."})   //Title is unique 
        }
        if (!isValidValue(excerpt)){
            return res.status(400).send({status:false, msg:"Please provide the excerpt"})   //Excerpt is mandory 
        }
        if (!isValidValue(userId)){
            return res.status(400).send({status:false, msg:"Please provide the User Id"})   //UserID is mandory 
        }
        const isValidUserId = await userModel.findById(userId)
        if (!isValidUserId){
            return res.status(404).send({status:true, msg:"User not found."})   //find User 
        }
        if (!isValidValue(ISBN)){
            return res.status(400).send({status:false, msg:"Please provide the ISBN"})   //ISBN is mandory 
        }
        const isDuplicateISBN = await bookModel.findOne({ISBN: ISBN})
        if (isDuplicateISBN){
            return res.status(400).send({status:true, msg:"ISBN already exists."})   //ISBN is unique 
        }
        if (!isValidValue(category)){
            return res.status(400).send({status:false, msg:"Please provide the Category"})   //Category is mandory 
        }
        if (!isValidValue(subcategory)){
            return res.status(400).send({status:false, msg:"Please provide the subCategory"})   //subcategory is mandory 
        }
        if (!isValidValue(releasedAt)){
            return res.status(400).send({status:false, msg:"Please provide the releasedAt"})   //releasedAt is mandory 
        }
        const release = moment()/*.format("YYYY-MM-DD")*/
        const finalData = {
            ...book,
            releasedAt : release
        } 
        const data = await bookModel.create(finalData)  //creating the Book details
        res.status(201).send({status: true, msg : "Book details saved successfully", data: data})
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}


// -----------GetBooks-----------------------------------------------------------------------------------
const getBooks = async function(req, res) {
    try{
        let userId = req.query.userId
        // let filter = {
        //     userId : userId,
        //     category : category,
        //     subcategory : subcategory,
        //     isDeleted: false,     //store the condition in filter variable
        //     // ...bookId
        // }
        if(!isValidDetails(userId)){
            res.status(400).send({status:false, msg:"Please provide the User details"})  //Validate the value that is provided by the Client.
        }
        if(!userId) {
            return res.status(400).send({status: false, msg: "Please provide the User Id."})   //Validating the UserID
        }

        const findBooks = await bookModel.findOne({_userId: userId, category : category, subcategory : subcategory, isDeleted: false})    //finding the college name in collegeModel with the key name as "name"
        if(!findBooks) {    //if unable to find the BookId in bookModel
            return res.status(404).send({status:false, msg: "No Book found with the provided UserId."})
        }
        const bookId = findBooks._id;    
        const allBooks = await bookModel.find({bookId : bookId}).select({bookId : 1, title : 1, excerpt : 1, userId : 1, category : 1, releasedAt : 1, reviews : 1})   //finding the Interns that they applied for the same college
        if(allBooks.length == 0) {   //if unable to find the books 
            return res.status(404).send({status: false, msg: "No Book found with the provided UserId."})
        }
        const finalbookData = {    //store the data in the Object
            bookId : findBooks.name,  
            title : findBooks.title,
            excerpt : findBooks.excerpt,
            userId : findBooks.userId,
            category : findBooks.category,
            releasedAt : findBooks.releasedAt,
            reviews : findBooks.reviews
        }
        console.log(finalbookData)
        res.status(200).send({status: true, data: finalbookData})
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}


// -----------getBooksById-----------------------------------------------------------------------------------
const getBooksById = async function(req, res) {
    try{
        const book = req.body
        if(!isValidDetails(book)){
            res.status(400).send({status:false, msg:"Please provide the Book details"})  //Validate the value that is provided by the Client.
        }
        const {title, name, phone, email, password} = user
        
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}


// -----------UpdateBooks-----------------------------------------------------------------------------------
const updateBooks = async function(req, res) {
    try{
        const book = req.body
        if(!isValidDetails(book)){
            res.status(400).send({status:false, msg:"Please provide the Book details"})  //Validate the value that is provided by the Client.
        }
        const {title, name, phone, email, password} = user
        
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}


// -----------DeleteBooks-----------------------------------------------------------------------------------
const deleteBooks = async function(req, res) {
    try{
        const book = req.body
        if(!isValidDetails(book)){
            res.status(400).send({status:false, msg:"Please provide the Book details"})  //Validate the value that is provided by the Client.
        }
        const {title, name, phone, email, password} = user
        
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}

module.exports.createBook = createBook;
module.exports.getBooks = getBooks;
module.exports.getBooksById = getBooksById;
module.exports.updateBooks = updateBooks;
module.exports.deleteBooks = deleteBooks;
