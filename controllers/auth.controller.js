const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const Admin = require("../models/Admin")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.registerAdmin = asyncHandler(async (req, res) => {
    // res.json({ message: "login user success" })
    const { name, email, password } = req.body
    const found = await Admin.findOne({ email })
    if (found) {
        return res.status(401).json({ message: "Email Already register with Us " })
    }
    const hash = await bcrypt.hash(password, 10)
    await Admin.create({ name, email, password: hash })
    res.json({ message: "admin register success" })
})
exports.loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const found = await User.findOne({ email })
    if (!found) {
        return res.status(401).json({ message: "Email not Register with Us " })
    }
    const verify = await bcrypt.compare(password, found.password)
    if (!verify) {
        return res.status(401).json({ message: "password Do Not Match " })
    }
    const token = jwt.sign({ userId: found._id }, process.env.JWT_KEY)
    res.cookie("admin", token, { httpOnly: true })
    res.json({
        message: "Admin Login Success", result: {
            _id: found._id,
            name: found.name,
            email: found.email,
        }
    })
    // res.json({ message: "login admin  success" })
})


exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const found = await User.findOne({ email })
    if (found) {
        return res.status(401).json({ message: "Email Already register with Us " })
    }
    const hash = await bcrypt.hash(password, 10)
    await Admin.create({ name, email, password: hash })
    res.json({ message: "login user logout success" })
})
exports.loginUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const found = await User.findOne({ email })
    if (!found) {
        return res.status(401).json({ message: "Email Already register with Us " })
    }
    const hash = await bcrypt.hash(password, 10)
    await Admin.create({ name, email, password: hash })
})
exports.logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("admin")
    res.json({ message: "admin logout success" })
})
