const express =
  require("express")

const router =
  express.Router()

const authenticate =
  require(
    "../middlewares/auth.middleware"
  )

const {

  addToCart,

  getCart,

  updateCartItem,

  deleteCartItem

} = require(
  "../controllers/cart.controller"
)

router.post(
  "/add",
  authenticate,
  addToCart
)

router.get(
  "/",
  authenticate,
  getCart
)

router.put(
  "/item/:id",
  authenticate,
  updateCartItem
)

router.delete(
  "/item/:id",
  authenticate,
  deleteCartItem
)

module.exports = router