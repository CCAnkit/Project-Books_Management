const bookModel = require("../models/bookModel.js");
const reviewModel = require("../models/reviewModel.js");
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


// -----------CreateReview-----------------------------------------------------------------------------------
const createReview = async function(req, res) {
    try{
        const review = req.body 
        const bookId = req.params.bookId
        const {reviewedBy, rating} = review
        const isValidBookId = await bookModel.findOne({_id : bookId, isDeleted:false})
        if(!isValidBookId){
            return res.status(404).send({status:true, msg:"no book found."})            
        }       
        if(!isValidDetails(review)){
            return res.status(400).send({status:false, msg:"please provide review of the book"})
        }
        if(!isValidValue(reviewedBy)){
            return res.status(400).send({status:false, msg:"please provide who reviewed the book"})
        }
        if(!isValidValue(rating)){
            return res.status(400).send({status:false, msg:"please provide the rating"})
        }
        if((rating<1) || (rating>5)){
            return res.status(400).send({status:false, msg:"rating should be greater than 1 and less than 5"})
        }
        const release = moment().format("YYYY-MM-DD");
        const finalData = {
            bookId : bookId,
            ...review,
            reviewedAt : release
        }
        const data = await reviewModel.create(finalData)
        res.status(201).send({status:true, msg:"book review saved successfully",data:data})
        
        let reviewCount = await reviewModel.find({ bookId: bookId }).count();
        let countUpdate = await bookModel.findOneAndUpdate(
            { _id: req.params.bookId },
            { reviews: reviewCount }
        );
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
        const bookIdFromReview = IsValidReviewId.bookId
        const userIdFromReview = await bookModel.findById(bookIdFromReview)
        if (userIdFromReview.userId.toString() !== IsValidBookId.userId.toString()) {          // for similar userId from param & bookModel to update
            return res.status(403).send({status : false, msg : "Unauthorized access. Review can't be updated"})
        }

        const dataToUpdate = req.body
        if(!isValidDetails(dataToUpdate)){
            res.status(400).send({status:false, msg:"Please provide the review details to update"})  //Validate the value that is provided by the Client.
        }
        const {review, rating, reviewedBy} = dataToUpdate
        if((rating<1) || (rating>5)){
            return res.status(400).send({status:false, msg:"rating should be greater than 1 and less than 5"})}
        const updatedDetails = await reviewModel.findOneAndUpdate(
            {_id : reviewId},   
            {review : review, rating : rating, reviewedBy : reviewedBy},
            {new : true})
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
        const bookIdFromReview = IsValidReviewId.bookId
        const userIdFromReview = await bookModel.findById(bookIdFromReview)
        if (userIdFromReview.userId.toString() !== IsValidBookId.userId.toString()) {          // for similar userId from param & bookModel to update
            return res.status(403).send({status : false, msg : "Unauthorized access. Review can't be delete"})
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
