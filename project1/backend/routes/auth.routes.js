const express = require("express")
const userModel = require("../models/userModel")
const authRouter = express.Router()
const bcrypt  = require("bcrypt")
const jwt  = require("jsonwebtoken")
const cookie = require("cookie-parser")
//register Route
authRouter.post("/register", async (req, res) => {
  try {
    const { email, password, username, bio, userProfile } = req.body

    if (!email || !password || !username) {
      return res.status(400).json({ message: "All fields required" })
    }

    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.email === email
            ? "Email already taken"
            : "Username not available"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await userModel.create({
      email,
      password: hashedPassword,
      username,
      bio,
      userProfile
    })

    const token = jwt.sign(
      { id: createdUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    )

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: createdUser._id,
        email: createdUser.email,
        username: createdUser.username
      }
    })

  } catch (err) {
    res.status(500).json({
      message: "Internal server error"
    })
  }
})
module.exports = authRouter
// login

authRouter.post("/login", async (req, res) => {
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

    res.status(200).json({
      message: "Successfully logged in",
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    })

  } catch (err) {
    res.status(500).json({
      message: "Something went wrong"
    })
  }
})