const asyncHandler = require("express-async-handler")
const Product = require("../models/Product")
const { upload } = require("../utils/upload")
const Order = require("../models/Order")
const User = require("../models/User")
const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
exports.getAllProducts = asyncHandler(async (req, res) => {
    const result = await Product.find()
    res.json({ message: "product Fetch Success", result })
})
exports.addProduct = asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: "upload error" })
        }

        const { secure_url } = await cloudinary.uploader.upload(req.file.path)

        // console.log(req.file.path);
        const result = await Product.create({ ...req.body, images: secure_url })
        res.json({ message: "product add Success", result })

        // await Product.create(req.body)
    })
})
exports.updateProduct = asyncHandler(async (req, res) => {
    await Product.findByIdAndUpdate(req.body, req.params.id)
    res.json({ message: "product update Success" })
})
exports.deleteProduct = asyncHandler(async (req, res) => {

    const result = await Product.findById(req.params.id)

    const str = result.images.split("/")
    const img = str[str.length - 1].split(".")[0]
    await cloudinary.uploader.destroy(img)
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: "product delete Success" })
})
exports.deactivateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Product.findByIdAndUpdate(id, { active: false })
    res.json({ message: "product Deactivate Success" })
})
exports.activateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Product.findByIdAndUpdate(id, { active: true })
    res.json({ message: "product activate Success" })
})
exports.getProductDetails = asyncHandler(async (req, res) => {
    const result = await Product.find()
    res.json({ message: "product  Detail Fetch Success" })
})

//orders
exports.getAllOrders = asyncHandler(async (req, res) => {
    const result = await Order.find()
        .populate("user", {
            password: 0, active: 0, createdAt: 0,
            updatedAt: 0,
            __v: 0

        })
        .populate("products.product", {
            __id: 1,
            name: 1,
            desc: 1,
            price: 1,
            mrp: 1,
            images: 1
        })
        // console.log(result.map(item => item))
        .sort({ createdAt: -1 })
    res.json({ message: "ordrs  Fetch success", result })
})
exports.getOrderDetail = asyncHandler(async (req, res) => {
    res.json({ message: "ordrs  order Details " })
})
exports.cancelOrder = asyncHandler(async (req, res) => {
    res.json({ message: "ordrs  cancel success" })
})
exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    await Order.findByIdAndUpdate(id, { status })
    res.json({ message: "ordrs  update success " })
})

// user
exports.getAllUser = asyncHandler(async (req, res) => {
    const result = await User.find()
    res.json({ message: "user fetch  Success", result })
})
exports.getUserDetails = asyncHandler(async (req, res) => {
    res.json({ message: "user Detail fetch  Success" })
})
exports.blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    await User.findByIdAndUpdate(id, { active: false })
    res.json({ message: "user Block Success" })
})
exports.unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    await User.findByIdAndUpdate(id, { active: true })
    res.json({ message: "user un-Block  Success" })
})
exports.getUserOrders = asyncHandler(async (req, res) => {
    res.json({ message: "user Order  fetch  Success" })
})


