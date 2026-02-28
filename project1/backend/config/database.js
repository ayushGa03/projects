const mongoose = require("mongoose");
let connectDb = async()=>{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("connected to db sucessfully")
}
module.exports = connectDb;