const express =
  require("express")

const router =
  express.Router()

const authenticate =
  require(
    "../middlewares/auth.middleware"
  )

const {

  createOrder,

  getOrders,

  getOrderById

} = require(
  "../controllers/order.controller"
)

router.post(
  "/",
  authenticate,
  createOrder
)

router.get(
  "/",
  authenticate,
  getOrders
)

router.get(
  "/:id",
  authenticate,
  getOrderById
)

module.exports = router