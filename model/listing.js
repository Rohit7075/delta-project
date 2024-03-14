const mongoose=require("mongoose")
const Schema =mongoose.Schema
const Review=require("./review.js")

// listning schema
const listingSchema=new Schema({
    title:{
        type:String,
       
    },
    description:String,
    image:
    {
    url:String,
    filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:
    [
{
    type:Schema.Types.ObjectId,
    ref:"Review"
}
    ],
owner:{
   type:Schema.Types.ObjectId,
   ref:"User" 
},
geometry:{
    type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
}

})
// suppose if we delete any listing then along with listing thier reviews will also be deleted
listingSchema.post("findOneAndDelete",async(listing)=>
{
    if(listing)
    {
        // wo saare review delete ho jayega jo ki listing ke id me h
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})


// creating model for listing Schema
const Listing=mongoose.model("Listing",listingSchema)
module.exports=Listing