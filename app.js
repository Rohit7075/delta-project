// this is basicallly for connecrting cloudinary with project with the help of their SECRET CODE
if(process.env.NODE_ENV!="production")
{
    require('dotenv').config()
}


const express=require("express")
const app=express()
const mongoose=require("mongoose")
// requiring mongoose model
// const Listing=require("./model/listing.js")
const path=require("path")
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
// require express-session
const session =require("express-session")
const MongoStore=require("connect-mongo")
const flash=require("connect-flash")
// require password aunthentication libraries
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./model/user.js")




// const wrapAsync=require("./utils/WrapAsync.js")
// const ExpressError=require("./utils/expressError.js")
// const {listingSchema,reviewSchema}=require("./schema.js")
// const Review=require("./model/review.js")
const listingRoutes=require("./routes/listing.js")
const reviewsRoutes=require("./routes/review.js")
const userRoutes=require("./routes/users.js")
const { error } = require('console')


// connecting with database

const dbUrl=process.env.ATLASDB_URL
main().then(()=>
{
    console.log("connected to db")
})
.catch((err)=>
{
    console.log(err)
})
async function main()
{
    await mongoose.connect(dbUrl)
}
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"public")))
// use flash


// CREATE  MONGO SESSION
const store=  MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
      secret:process.env.SECRET,
    },
    touchAfter: 24*3600
    }) 
      
store.on("error",()=>
{
    console.log("Error in Mongo store",err)
})    
    
// use express session 
const sessionOptions={
    store,
    secret:process.env.SECRET , resave:false , saveUninitialized:true,
    cookie:
    {
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,

    }

}
// CREATE MONGO SESSION 




app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>
{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error");
    // this res.local  to create used for showing login and signup  when new user visit
    // and hide logout
    res.locals.currUser=req.user
    next()
})
// let create a demo user
// app.get("/demouser",async(req,res)=>
// {
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     })
//     let registeredUser= await User.register(fakeUser,"helloworld")
//     res.send(registeredUser)
// })




// this is middleware to validate schema and it use in create and update 
// route 
// const validateListing=(req,res,next)=>
// {
//     let{error}=listingSchema.validate(req.body)
   
//     if(error)
//     {
//         let errMsg=error.details.map((el)=>el.message).join(",")
//       throw new ExpressError(404,errMsg)
//     }
//     else
//     {
//         next()
//     }
// }
// this is middleware for validating review
// const validateReview=(req,res,next)=>
// {
//     let{error}=reviewSchema.validate(req.body)
   
//     if(error)
//     {
//         let errMsg=error.details.map((el)=>el.message).join(",")
//       throw new ExpressError(404,errMsg)
//     }
//     else
//     {
//         next()
//     }
// }

app.use("/listings",listingRoutes)
app.use("/listings/:id/reviews",reviewsRoutes)
app.use("/",userRoutes)
// index route
// app.get("/listings",async(req,res)=>
// {
//    const allListings=await Listing.find({})
//    res.render("listings/index.ejs",{allListings})
// })
// // new route
// app.get("/listings/new",(req,res)=>
// {
//     res.render("listings/new.ejs")
// })
    
// // show route
// app.get("/listings/:id",wrapAsync(async(req,res)=>
// {
//     let {id}=req.params
//      const listing=await Listing.findById(id).populate("reviews")
//      res.render("listings/show.ejs",{listing})

// }))
// // Create routes
// app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>
// {
//     // this is for schema validation if any object of model is missing then it throw error

 
  
//     const newListing=new Listing (req.body.listing)
//     await newListing.save()
//     res.redirect("/listings")
//   }))
  
  
 
    
 


// // edit routes
// app.get("/listings/:id/edit",wrapAsync(async(req,res)=>
// {
//     let {id}=req.params
//     const listing=await Listing.findById(id)
//    res.render("listings/edit.ejs",{listing})
// }))
// // UPDATE ROUTES
// app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>
// {
  
//     let{id}=req.params
//     await  Listing.findByIdAndUpdate(id,{...req.body.listing})
//     res.redirect("/listings")
// }))
// // DELETE ROUTE
// app.delete("/listings/:id",wrapAsync(async(req,res)=>
// {
//     let {id}=req.params
//     let deleteListing=  await Listing.findByIdAndDelete(id)
//     console.log(deleteListing)
//     res.redirect("/listings")

// }))
// review routes
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>
// {
//     // extract id of listings
//     let listing=  await Listing.findById(req.params.id)
//     // add new review
//     let newReview=  new Review(req.body.review)
//     listing.reviews.push(newReview)
//     await newReview.save()
//     await listing.save()
//   res.redirect(`/listings/${listing._id}`)
// }))
// // creating delete routes
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>
// {
//     // extract listing andreview id
//     let{id,reviewId}=req.params
//     // here we use pull operator to delete the array of review which are stored in listing
//     // schema
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
//     // here we find the review by their id and then delete it
//     await Review.findByIdAndDelete(reviewId)
//     res.redirect(`/listings/${id}`)

// }))
 
// app.get("/testListing", async(req,res)=>
// {
//     let sampleListing=new Listing({
//         title:"home",
//         description:" by the beach",
//         price:1200,
//         location:"calcungaat",
//         country:"india",
//     })
//     await sampleListing.save()
//     console.log("sample was saved")
//     res.send("sample was saved")
// })

// HERE WE ALSE UNCPMMENT IT
// app.all("*",(req,res,next)=>
// {
//     next(new ExpressError(404,"PAGE NOT FOUND"))
// })



// creating middleware to handle error
app.use((err,req,res,next)=>
{
    let{statusCode=500,message="something went wrong"}=err
    res.status(statusCode).render("error.ejs",{message})
})
app.listen(8080,()=>
{
    console.log("app is listening to the port")
})