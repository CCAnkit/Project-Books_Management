const bookModel = require("../models/bookModel.js");
const userModel = require("../models/userModel.js");
const reviewModel = require("../models/reviewModel.js");
const validator = require('../validators/validator.js');

// -----------CreateBooks-----------------------------------------------------------------------------------
const createBook = async function(req, res) {
    try{
        const book = req.body
        if(!validator.isValidDetails(book)){
            res.status(400).send({status:false, msg:"Please provide the Book details"})   //Validate the value that is provided by the Client.
        }
        const {title, excerpt, userId, ISBN, category, subcategory, releasedAt} = book
        if (userId != req.userId) {
            return res.status(403).send({status: false, message: "Unauthorized access."})
        }
        if (!validator.isValidValue(title)){
            return res.status(400).send({status:false, msg:"Please provide the Title"})   //Title is Mandory 
        }
        const isDuplicateTitle = await bookModel.findOne({title: title})
        if (isDuplicateTitle){
            return res.status(400).send({status:true, msg:"Title is already exists."})   //Title is Unique 
        }
        if (!validator.isValidValue(excerpt)){
            return res.status(400).send({status:false, msg:"Please provide the excerpt"})   //Excerpt is Mandory 
        }
        // if (!validator.isValidValue(userId)){
        //     return res.status(400).send({status:false, msg:"Please provide the User Id"})   //UserID is Mandory 
        // }
        const isValidUserId = await userModel.findById(userId)
        if (!isValidUserId){
            return res.status(404).send({status:true, msg:"User not found."})   //find User in userModel
        }
        if (!validator.isValidValue(ISBN)){
            return res.status(400).send({status:false, msg:"Please provide the ISBN"})   //ISBN is mandory 
        }
        const isDuplicateISBN = await bookModel.findOne({ISBN: ISBN})
        if (isDuplicateISBN){
            return res.status(400).send({status:true, msg:"ISBN is already exists."})   //ISBN is unique 
        }
        if (!validator.isValidValue(category)){
            return res.status(400).send({status:false, msg:"Please provide the Category"})   //Category is mandory 
        }
        if (!validator.isValidValue(subcategory)){
            return res.status(400).send({status:false, msg:"Please provide the subCategory"})   //subcategory is mandory 
        }
        if (!validator.isValidValue(releasedAt)){
            return res.status(400).send({status:false, msg:"Please provide the release date of book."})   //release date is mandory 
        }
        if(!(/^\d{4}-\d{2}-\d{2}$/.test(releasedAt))){   //regex for checking the correct format of release date 
            return res.status(400).send({status:false,msg:`${releasedAt} is an invalid date, formate should be like this YYYY-MM-DD`})
        }
        const saved = await bookModel.create(book)  //creating the Book details
        res.status(201).send({status: true, msg : "Book is created successfully.", data: saved})

    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}


// -----------GetBooks-----------------------------------------------------------------------------------
const getAllBooks = async function(req, res) {
    try{
        const querry = req.query
        const filter = {
            ...querry,         //store the conditions in filter variable
            isDeleted : false
        }
        const findBooks = await bookModel.find(filter).select({title : 1, excerpt : 1, userId : 1, category : 1, releasedAt : 1, reviews : 1}).sort({title : 1})
        //finding the book with filters
        if (findBooks.length == 0){
            return res.status(404).send({status:true, msg:"No book found."})       //Validate the value that is provided by the Client.
        }
        if (findBooks.userId != req.userId) {
            return res.status(403).send({status: false, message: "Unauthorized access."})
        }
        res.status(200).send({status: true, msg: "Books list", data: findBooks})  
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}


// -----------getBooksById-----------------------------------------------------------------------------------
const getBooksById = async function(req, res) {
    try{
        const bookId = req.params.bookId        
        const bookDetails = await bookModel.findOne({_id : bookId, isDeleted:false})     //finding the bookId
        if (!bookDetails){
            return res.status(404).send({status:true, msg:"No books found."})     //If no Books found in bookModel
        }
        if (bookDetails.userId != req.userId) {
            return res.status(403).send({status: false, message: "Unauthorized access."})
        }
        const reviews = await reviewModel.find({bookId : bookId})     //finding the bookId in review Model
        const finalBookDetails = {
            ...bookDetails._doc,        //Storing data into new Object
            reviewsData : reviews
        }        
        res.status(200).send({status:true, msg:"Books list.", data:finalBookDetails})   
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}


// -----------UpdateBooks-----------------------------------------------------------------------------------
const updateBooks = async function(req, res) {
    try{
        const bookId = req.params.bookId
        const IsValidBookId = await bookModel.findOne({_id : bookId, isDeleted : false})        //finding the bookId
        if (!IsValidBookId){
            return res.status(404).send({status:true, msg:"no book found."})
        }
        if (IsValidBookId.userId != req.userId) {
            return res.status(403).send({status: false, message: "Unauthorized access."})
        }
        const dataToUpdate = req.body
        if(!validator.isValidDetails(dataToUpdate)){
            res.status(400).send({status:false, msg:"Please provide the Book details to update"})  //Validate the value that is provided by the Client.
        }
        const {title, ISBN} = dataToUpdate
        const isDuplicateTitle = await bookModel.findOne({title : title})     //Title is unique
        if (isDuplicateTitle){
            return res.status(400).send({staus:false, msg:"Book with provided title is already present."})
        }
        const isDuplicateISBN = await bookModel.findOne({ISBN:ISBN})        //ISBN is unique
        if (isDuplicateISBN){
            return res.status(400).send({staus:false, msg:"Book with provided ISBN no. is already present."})
        }
        const updatedDetails = await bookModel.findOneAndUpdate(
            {_id : bookId},    //Find the bookId and update these title, excerpt & ISBN.
            {title : dataToUpdate.title, excerpt : dataToUpdate.excerpt, ISBN : dataToUpdate.ISBN},
            {new : true, upsert : true})    //ispublished will be true and update the date at publishAt.
        res.status(201).send({status:true, msg: "book details updated successfully", data:updatedDetails})
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}


// -----------DeleteBooks-----------------------------------------------------------------------------------
const deleteBooks = async function(req, res) {
    try{
        const bookId = req.params.bookId
        const IsValidBookId = await bookModel.findOne({_id : bookId, isDeleted : false})      //finding the bookId
        if (!IsValidBookId){
            return res.status(404).send({status:true, msg:"No book found."})
        }
        if (IsValidBookId.userId != req.userId) {
            return res.status(403).send({status: false, message: "Unauthorized access."})
        }
        const deletedDetails = await bookModel.findOneAndUpdate(
            {_id : bookId},    //finding the bookId and mark the isDeleted to true & update the date at deletedAt.
            {isDeleted : true, deletedAt : new Date()},
            {new : true})    
        res.status(201).send({status:true, msg:"Book deleted successfully",data:deletedDetails})       
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}

    module.exports.createBook = createBook;
    module.exports.getAllBooks = getAllBooks;
    module.exports.getBooksById = getBooksById;
    module.exports.updateBooks = updateBooks;
    module.exports.deleteBooks = deleteBooks;
