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
        const {reviewedBy, rating} = review
        
        const isValidBookId = await bookModel.findOne({_id : bookId, isDeleted : false})
        if (!isValidBookId) {
            return res.status().send({status: true, msg: "No book found with this provided Book ID"})   //check the bookId in book model
        }
        if(isValidBookId['isDeleted'] == true){
            return res.status(404).send({status:true, msg:"The book is no longer present."})
        }
        if(!isValidDetails(review)){
            res.status(400).send({status:false, msg:"Please provide the details"})  //Validate the value that is provided by the Client.
        }
        if(!isValidValue(reviewedBy)){
            return res.status(400).send({status:false, msg:"please provide who reviewed the book"})         //reviewBy is mandory 
        }
        if(!isValidValue(rating)){      
            return res.status(400).send({status:false, msg:"please provide the rating"})        //ratings is mandory
        }       
        if((rating<1) || (rating>5)){
            return res.status(400).send({status:false, msg:"rating should be greater than 1 and less than 5"})
        }
        const release = moment().format("YYYY-MM-DD, h-mm-ss");
        const finalData = {
            bookId : bookId,
            ...review,
            releasedAt : release
        }
        const data = await reviewModel.create(finalData)
        res.status(201).send({status:true, msg:"book review saved successfully",data:data})
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}


// -----------UpdateReview-----------------------------------------------------------------------------------
const updateReview = async function(req, res) {
    try{
        const bookId = req.params.bookId
        const IsValidBookId = await bookModel.findOne({_id : bookId, isDeleted:false})
        if (!IsValidBookId){
            return res.status(404).send({status:true, msg:"no book found to update review."})
        }
        const reviewId = req.params.reviewId
        const IsValidReviewId = await reviewModel.findOne({_id : reviewId, isDeleted:false})
        if (!IsValidReviewId){
            return res.status(400).send({status:true, msg:"no review exists to update."})
        }
        const userIdFromParam = req.params.userId
        const userIdFromBook = IsValidBookId.userId.toString()    //change the userId to string
        if (userIdFromParam !== userIdFromBook) {          // for similar userId from param & bookModel to update
            return res.status(403).send({status : false, msg : "Unauthorized access. Review can't be updated"})
        }
        const dataToUpdate = req.body
        if(!isValidDetails(dataToUpdate)){
            res.status(400).send({status:false, msg:"Please provide the review details to update"})  //Validate the value that is provided by the Client.
        }
        const {review, rating, reviewedBy} = dataToUpdate
        const updatedDetails = await reviewModel.findOneAndUpdate(
            {_id : reviewId},   
            {review : review, rating : rating, reviewedBy : reviewedBy},
            {new : true, upsert : true})
        res.status(201).send({status:true, msg:"review updated successfully", data:updatedDetails})        
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}


// -----------DeleteReview-----------------------------------------------------------------------------------
const deleteReview = async function(req, res) {
    try{
        const bookId = req.params.bookId
        const IsValidBookId = await bookModel.findOne({_id : bookId, isDeleted:false})
        if (!IsValidBookId){
            return res.status(404).send({status:true, msg:"no book found to delete review."})
        }
        const reviewId = req.params.reviewId
        const IsValidReviewId = await reviewModel.findOne({_id : reviewId, isDeleted:false})
        if (!IsValidReviewId){
            return res.status(404).send({status:true, msg:"no review exists to delete."})
        }
        const userIdFromParam = req.params.userId
        const userIdFromBook = IsValidBookId.userId.toString()    //change the userId to string
        if (userIdFromParam !== userIdFromBook) {          // for similar userId from param & bookModel to update
            return res.status(403).send({status : false, msg : "Unauthorized access. Review can't be deleted"})
        }
        const deletedData = await reviewModel.findOneAndUpdate(
            {_id : reviewId},   
            {isDeleted : true, deletedAt : new Date()},
            {new : true})
        res.status(201).send({status:true, msg:"review deleted successfully", data:deletedData})    
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}


module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;
