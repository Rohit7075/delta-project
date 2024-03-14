const Listing=require("../model/listing.js")
const Review=require("../model/review.js")


module.exports.createReview=async(req,res)=>
{
    // extract id of listings
    let listing=  await Listing.findById(req.params.id)
    // add new review
    let newReview=  new Review(req.body.review)
    listing.reviews.push(newReview)
    newReview.author=req.user._id
    await newReview.save()
    await listing.save()
    req.flash("success","new Review created")
  res.redirect(`/listings/${listing._id}`)
}


module.exports.deleteReview=async(req,res)=>
{
    // extract listing andreview id
    let{id,reviewId}=req.params
    
    // here we use pull operator to delete the array of review which are stored in listing
    // schema
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    // here we find the review by their id and then delete it
    await Review.findByIdAndDelete(reviewId)
    req.flash("success"," Review Deleted")
    res.redirect(`/listings/${id}`)

}