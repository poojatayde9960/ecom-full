const asyncHandler = require("express-async-handler")
const Product = require("../models/Product")
const { upload } = require("../utils/upload")
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
    await Product.findByIdAndUpdate(req.body, req.params.id)
    res.json({ message: "product Deactivate Success" })
})
exports.activateProduct = asyncHandler(async (req, res) => {
    await Product.findByIdAndUpdate(req.body, req.params.id)
    res.json({ message: "product activate Success" })
})
exports.getProductDetails = asyncHandler(async (req, res) => {
    const result = await Product.find()
    res.json({ message: "product  Detail Fetch Success" })
})

//orders
exports.getAllOrders = asyncHandler(async (req, res) => {
    res.json({ message: "ordrs  Fetch update" })
})
exports.getOrderDetail = asyncHandler(async (req, res) => {
    res.json({ message: "ordrs  order Details " })
})
exports.cancelOrder = asyncHandler(async (req, res) => {
    res.json({ message: "ordrs  cancel success" })
})
exports.updateOrderStatus = asyncHandler(async (req, res) => {
    res.json({ message: "ordrs  update success " })
})

// user
exports.getAllUser = asyncHandler(async (req, res) => {
    res.json({ message: "user fetch  Success" })
})
exports.getUserDetails = asyncHandler(async (req, res) => {
    res.json({ message: "user Detail fetch  Success" })
})
exports.blockUser = asyncHandler(async (req, res) => {
    res.json({ message: "user Block Success" })
})
exports.unblockUser = asyncHandler(async (req, res) => {
    res.json({ message: "user un-Block  Success" })
})
exports.getUserOrders = asyncHandler(async (req, res) => {
    res.json({ message: "user Order  fetch  Success" })
})


