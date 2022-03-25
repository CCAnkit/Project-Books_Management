const bookModel = require("../models/bookModel.js");
const reviewModel = require("../models/reviewModel.js");

// -----------validation-----------------------------------------------------------------------------------
const isValidValue = function(value){   //it should not be like undefined or null.
    if (typeof value === 'undefined' || value === null) return false   //if the value is undefined or null it will return false.
    if (typeof value === 'string' && value.trim().length === 0) return false   //if the value is string & length is 0 it will return false.
    return true
}
    
const isValidDetails = function(details){   
    return Object.keys(details).length > 0
}


// -----------CreateReview-----------------------------------------------------------------------------------
const createReview = async function(req, res) {
    try{
        const review = req.body
        const bookId = req.params.bookId
        const {reviewedBy, reviewAt, rating} = review
        
        if(!isValidDetails(review)){
            res.status(400).send({status:false, msg:"Please provide the details"})  //Validate the value that is provided by the Client.
        }
        if (!bookId){
            return res.status(404).send({status:false, msg:"Please provide the Book ID in path params."})   //bookId is mandory 
        }
        const isValidBookId = await bookModel.findOne({_id : bookId, isDeleted : false})
        if (!isValidBookId) {
            return res.status().send({status: true, msg: "No book found with this provided Book ID"})   //check the bookId in book model
        }
        const totalReviews = isValidBookId.review
        const reviewCounts = totalReviews.length
        

        if (!isValidValue(reviewedBy)){
            return res.status(404).send({status:false, msg:"Please provide the ReviewBy"})   //reviewBy is mandory 
        }
        if (!isValidValue(reviewAt)){
            return res.status(404).send({status:false, msg:"Please provide the RewiewAt"})    //reviewAt is mandory
        }
        if (!isValidValue(ratings)){
            return res.status(404).send({status:false, msg:"Please provide the ratings"})    //ratings is mandory
        }
        if(rating < 1 && rating > 5){
            return res.status(400).send({status:false, msg:"rating should be greater than 1 and less than 5"})
        }
        res.send("done")

    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}


// -----------UpdateReview-----------------------------------------------------------------------------------
const updateReview = async function(req, res) {
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


// -----------DeleteReview-----------------------------------------------------------------------------------
const deleteReview = async function(req, res) {
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


module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;
