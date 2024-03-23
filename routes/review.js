// here its time to reconstruct the review 
const express=require("express")
const router=express.Router({mergeParams:true})
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/expressError.js")

const Listing=require("../model/listing.js")
const Review=require("../model/review.js")
const {validateReview, isLoggedin, isAuthor}=require("../middleware.js")
const reviewController=require("../controller/reviews.js")
const review = require("../model/review.js")




router.post("/", isLoggedin, validateReview,wrapAsync(reviewController.createReview))
// creating delete routes
router.delete("/:reviewId",isLoggedin,isAuthor,wrapAsync(reviewController.deleteReview))



module.exports=router