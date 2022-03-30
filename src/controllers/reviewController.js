const moment = require("moment");
const bookModel = require("../models/bookModel.js");
const reviewModel = require("../models/reviewModel.js");
const validator = require('../validators/validator.js');

// -----------CreateReview-----------------------------------------------------------------------------------
const createReview = async function(req, res) {
    try{
        const review = req.body 
        const bookId = req.params.bookId
        const {reviewedBy, rating} = review
        const isValidBookId = await bookModel.findOne({_id : bookId, isDeleted:false})       //finding the bookId
        if(!isValidBookId){
            return res.status(404).send({status:true, msg:"no book found."})      
        }       
        if(!validator.isValidDetails(review)){
            return res.status(400).send({status:false, msg:"please provide review of the book"})        //review is mandatory
        }
        if(!validator.isValidValue(reviewedBy)){
            return res.status(400).send({status:false, msg:"please provide who reviewed the book"})     //reviewedBy is mandatory
        }
        if(!validator.isValidValue(rating)){
            return res.status(400).send({status:false, msg:"please provide the rating"})        //rating is mandatory
        }
        if((rating<1) || (rating>5)){       //ratings should be in between 1 to 5.
            return res.status(400).send({status:false, msg:"rating should be greater than 1 and less than 5"})
        }
        const release = moment().format("YYYY-MM-DD");      //Moment for record the date & time
        const finalData = {
            bookId : bookId,
            ...review,          //storing the data in the variable
            reviewedAt : release
        }
        const data = await reviewModel.create(finalData)
        res.status(201).send({status:true, msg:"book review saved successfully",data:data})
        
        const reviewCount = await reviewModel.find({ bookId: bookId, isDeleted:false})
        const countUpdate = await bookModel.findOneAndUpdate(
            { _id: req.params.bookId },
            { reviews: reviewCount.length }
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
        const IsValidBookId = await bookModel.findOne({_id : bookId, isDeleted:false})      //finding the bookId
        if (!IsValidBookId){
            return res.status(404).send({status:true, msg:"No book found to update review."})       //
        }
        const reviewId = req.params.reviewId        
        const IsValidReviewId = await reviewModel.findOne({_id : reviewId, isDeleted:false})        //finding the reviewId
        if (!IsValidReviewId){
            return res.status(400).send({status:true, msg:"no review exists to update."})
        }
        const bookIdFromReview = IsValidReviewId.bookId
        const userIdFromReview = await bookModel.findById(bookIdFromReview)
        if (userIdFromReview.userId.toString() !== IsValidBookId.userId.toString()) {          // for similar userId from param & bookModel to update
            return res.status(403).send({status : false, msg : "Unauthorized access. Review can't be updated"})
        }
        const dataToUpdate = req.body
        if(!validator.isValidDetails(dataToUpdate)){
            res.status(400).send({status:false, msg:"Please provide the review details to update"})  //Validate the value that is provided by the Client.
        }
        const {review, rating, reviewedBy} = dataToUpdate
        if((rating<1) || (rating>5)){       //ratings should be in between 1 to 5.
            return res.status(400).send({status:false, msg:"rating should be greater than 1 and less than 5"})
        }
        const updatedDetails = await reviewModel.findOneAndUpdate(
            {_id : reviewId},    //finding the reviewId and update the details.
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
            return res.status(404).send({status:true, msg:"No book found to delete review."})
        }
        const reviewId = req.params.reviewId
        const IsValidReviewId = await reviewModel.findOne({_id : reviewId, isDeleted:false})
        if (!IsValidReviewId){
            return res.status(404).send({status:true, msg:"no review exists to delete."})
        }
        const bookIdFromReview = IsValidReviewId.bookId
        const userIdFromReview = await bookModel.findById(bookIdFromReview)
        if (userIdFromReview.userId.toString() !== IsValidBookId.userId.toString()) {     //for checking the similar userId from params or bookModel.
            return res.status(403).send({status : false, msg : "Unauthorized access. Review can't be delete"})
        }

        const deletedData = await reviewModel.findOneAndUpdate(
            {_id : reviewId},     //finding the reviewId and mark the isDeleted to true & update the date at deletedAt.
            {isDeleted : true, deletedAt : new Date()},
            {new : true})
        res.status(201).send({status:true, msg:"Review deleted successfully", data:deletedData})

        const reviewCount = await reviewModel.find({ bookId: bookId,  isDeleted:false})
        const countUpdate = await bookModel.findOneAndUpdate(
            { _id: req.params.bookId },
            { reviews: reviewCount.length }
        );
    }
    catch(err) {
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}


module.exports = {
    createReview,
    updateReview,
    deleteReview,
}