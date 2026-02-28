

const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true ,"username already exist"],
        required:[true]
    },
    password:{
         type:String,
        required:[true]
    },
    email:{
         type:String,
        required:[true],
        unique:[true,"Email already registered"]
    },
    userProfile: {
        type: String,
        default:"https://ik.imagekit.io/ypvropbhv/default.png"
    },
    bio:{
        type:String
    }
})
const userModel = mongoose.model("users",userSchema)
module.exports = userModel