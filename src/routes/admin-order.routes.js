const express =
  require("express")

const router =
  express.Router()

const authenticate =
  require(
    "../middlewares/auth.middleware"
  )

const isAdmin =
  require(
    "../middlewares/admin.middleware"
  )

const {

  getAllOrders,
  getAdminOrderById,
  updateOrderStatus

} = require(
  "../controllers/order.controller"
)

router.get(
  "/",
  authenticate,
  isAdmin,
  getAllOrders
)

router.get(
  "/:id",
  authenticate,
  isAdmin,
  getAdminOrderById
)

router.put(
  "/:id/status",
  authenticate,
  isAdmin,
  updateOrderStatus
)

module.exports = router