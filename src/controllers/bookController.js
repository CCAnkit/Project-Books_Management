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

const isValidTitle = function(title){
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
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
        if (!isValidTitle(title)){
            return res.status(400).send({status:false, msg:"title should be Mr, Miss or Mrs"})  //enum is handle
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
        // if (!isValidValue(releasedAt)){
        //     return res.status(400).send({status:false, msg:"Please provide the releasedAt"})   //releasedAt is mandory 
        // }
        const release = moment()/*.format("YYYY-MM-DD, h:mm:ss")*/
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
        // if(!isValidUserId.length == 0){
        //     res.status(404).send({status:false, msg:"No Book found with the provided user ID"})  //Validate the value that is provided by the Client.
        // }
        const querry = req.query
        const filter = {
            ...querry,         //store the condition in filter variable
            isDeleted : false
        }
        const findBooks = await bookModel.find(filter).select({title : 1, excerpt : 1, userId : 1, category : 1, releasedAt : 1, reviews : 1})
        if (findBooks.length == 0){
            return res.status(404).send({status:true, msg:"no book found."})
        }
        const sortedBooks = findBooks.sort(function(a, b){
            if(a.title < b.title) { return -1; }
            if(a.title > b.title) { return 1; }
            return 0;
        })
        res.status(200).send({status: true, msg: Bookslist, data: sortedBooks})
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
        const bookDetails = await bookModel.findOne({_id : bookId, isDeleted:false})
        if (!bookDetails){
            return res.status(404).send({status:true, msg:"no book found."})
        }
        const reviews = await reviewModel.find({bookId:bookId})
        const finalBookDetails = {
            ...bookDetails._doc,
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
        const IsValidBookId = await bookModel.findById(bookId)
        if (!IsValidBookId){
            return res.status(404).send({status:true, msg:"no book found."})
        }
        // if (IsValidBookId['isDeleted'] == true){
            // return res.send(404).send({status:true, msg:"the book has been deleted"})
        // }
        const userIdFromParam = req.params.userId
        const userIdFromBook = IsValidBookId.userId.toString()    //change the userId to string
        if (userIdFromParam !== userIdFromBook) {          // for similar userId from param & bookModel to update
            return res.status(403).send({status : false, msg : "This is not your book, you can not update it."})
        }
        const dataToUpdate = req.body
        if(!isValidDetails(dataToUpdate)){
            res.status(400).send({status:false, msg:"Please provide the Book details to update"})  //Validate the value that is provided by the Client.
        }
        const {title, ISBN} = dataToUpdate
        const isDuplicateTitle = await bookModel.findOne({title:title})
        if (isDuplicateTitle){
            return res.status(400).send({staus:false, msg:"book with provided title is already present."})
        }
        const isDuplicateISBN = await bookModel.findOne({ISBN:ISBN})
        if (isDuplicateISBN){
            return res.status(400).send({staus:false, msg:"book with provided ISBN no. is already present."})
        }
        const updatedDetails = await bookModel.findOneAndUpdate(
            {_id : bookId},    //update the title, body, tage & subcategory.
            {title : dataToUpdate.title, excerpt : dataToUpdate.excerpt, ISBN : dataToUpdate.ISBN, releasedAt : new Date()},
            {new : true, upsert : true})    //ispublished will be true and update the date at publishAt.
        res.status(201).send({status:true, data:updatedDetails})
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
        const IsValidBookId = await bookModel.findById(bookId)
        if (!IsValidBookId){
            return res.status(404).send({status:true, msg:"no book found."})
        }
        // if (IsValidBookId["isDeleted"] === false){
        //     return res.send(404).send({status:true, msg:"the book has been already deleted"})
        // }
        const userIdFromParam = req.params.userId
        const userIdFromBook = IsValidBookId.userId.toString()    //change the userId to string
        if (userIdFromParam !== userIdFromBook) {          // for similar userId from param & bookModel to update
            return res.status(403).send({status : false, msg : "This is not your book, you can not delete it."})
        }
        const deletedDetails = await bookModel.findOneAndUpdate(
            {_id : bookId},    //update the title, body, tage & subcategory.
            {isDeleted : true, deletedAt : new Date()},
            {new : true})    //ispublished will be true and update the date at publishAt.
        res.status(201).send({status:true, msg:"book deleted successfully",data:deletedDetails})
        
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
