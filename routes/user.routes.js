const router = require("express").Router()
const userController = require("./../controllers/user.controller")

router
    .get("/order/:id", userController.userGetAllOrders)
    .get("/order-details/:id", userController.userGetAllOrderDetails)
    .post("/place-order", userController.userPlaceOrder)
    .put("/order-cancel/:id", userController.userCancelOrder)
    .post("/update-password", userController.userUpdatePassword)
module.exports = router