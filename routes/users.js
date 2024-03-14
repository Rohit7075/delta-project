const express=require("express")
const router=express.Router()
const User=require("../model/user.js")
const WrapAsync = require("../utils/WrapAsync.js")
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware.js")
const userController=require("../controller/users.js")


router.get("/signup",userController.renderSignup)

router.post("/signup",WrapAsync(userController.signup))

router.get("/login",userController.renderLogin)


// yha saveRedirectURL ko call krenge
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login)

// create route for logout
router.get("/logout",userController.logout)


module.exports=router
