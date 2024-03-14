const Listing = require("./model/listing")
const Review = require("./model/review")
const ExpressError=require("./utils/expressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")

module.exports.isLoggedin=(req,res,next)=>
{
    if(!req.isAuthenticated())
    {
        // console.log(req.path ,"..", req.originalUrl)
        // storing this original uerl in redirect url
        req.session.redirectUrl=req.originalUrl
        req.flash("error","you must be logged in create listing")
      return  res.redirect("/login")
    }
    next()
}

// 1   - originalurl ko req,session.redirectUrl me store krenge
//    req.session.redirect ko res.locals.redirectUrl me store krenge
//   middleware name called saveaRedirecturl ko user.js ke login routes me call krenge

module.exports.saveRedirectUrl=(req,res,next)=>
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next()
}

// this middleware is used creating owner for authorization 
module.exports.isOwner=  async(req,res,next)=>
{
    let {id}=req.params
    let listing=   await  Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id))
    {
        req.flash("error","you are not owner of the listing")
        return res.redirect(`/listings/${id}`)
    }
    next()
}


// this is middleware to validate schema and it use in create and update 
// route

 module.exports.validateListing=(req,res,next)=>
{
    let{error}=listingSchema.validate(req.body)
   
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(404,errMsg)
    }
    else
    {
        next()
    }
}

// this is middleware for validating review
module.exports.validateReview=(req,res,next)=>
{
    let{error}=reviewSchema.validate(req.body)
   
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(404,errMsg)
    }
    else
    {
        next()
    }
}


// // this middleware is used creating  review owner for authorization 
module.exports.isAuthor=  async(req,res,next)=>
{
    let {id,reviewId}=req.params
    let review =  await Review.findById(reviewId)
    if(!review.author.equals(res.locals.currUser._id))
    {
        req.flash("error","you are not owner of the review")
        return res.redirect(`/listings/${id}`)
    }
    next()
}