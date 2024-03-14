// this file is basically used for reconstructing all listing
const express=require("express")
const router=express.Router()
const wrapAsync=require("../utils/WrapAsync.js")

const Listing=require("../model/listing.js")
const {isLoggedin, isOwner,validateListing} =require("../middleware.js")
const { index } = require("../controller/listings.js")
const listingController=require("../controller/listings.js")
const multer=require("multer")
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})


// 
//  index routes to show all the list
router.get("/",wrapAsync(listingController.index))


// new route
router.get("/new",isLoggedin,(listingController.renderNewForm))

    
// show route
router.get("/:id",wrapAsync(listingController.showForm))
// Create routes
router.post("/",isLoggedin,upload.single("listing[image]"),validateListing,wrapAsync(listingController.CreateForm))
 

// edit routes
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.editForm))
// UPDATE ROUTES
router.put("/:id",isLoggedin,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateForm))
// DELETE ROUTE
router.delete("/:id",isLoggedin,isOwner,wrapAsync(listingController.deleteForm))

module.exports=router