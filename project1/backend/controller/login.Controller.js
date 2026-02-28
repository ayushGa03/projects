const bcrypt  = require("bcrypt")
const jwt  = require("jsonwebtoken")
const cookie = require("cookie-parser")
const userModel = require("../models/userModel")

async function loginController (req, res){
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: "Please register first"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      })
    }
   let token = jwt.sign({
id: user._id
   },process.env.SECRET_KEY)
   res.cookie("token", token)

    res.status(200).json({
      message: "Successfully logged in",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        token:token
      }
    })

  } catch (err) {
    res.status(500).json({
      message: "Something went wrong"
    })
  }
}
module.exports= loginController