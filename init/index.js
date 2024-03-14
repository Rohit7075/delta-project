const mongoose=require("mongoose")
const initdata=require("./data.js")
const Listing=require("../model/listing.js")

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust2"
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
    await mongoose.connect(MONGO_URL)
}

const initDB=async()=>
{
    await Listing.deleteMany({})
      initdata.data= initdata.data.map((obj)=>({...obj,owner:"65e851679e32ef5ec6522ca8"}))
    await Listing.insertMany(initdata.data)
    console.log("data was saved")
}
initDB()