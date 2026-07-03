const express =
  require("express")

const router =
  express.Router()

const authenticate =
  require(
    "../middlewares/auth.middleware"
  )

const {

  addToWishlist,

  getWishlist,

  removeWishlist,

  checkWishlist

} = require(
  "../controllers/wishlist.controller"
)

router.post(
  "/",
  authenticate,
  addToWishlist
)

router.get(
  "/",
  authenticate,
  getWishlist
)

router.delete(
  "/:productId",
  authenticate,
  removeWishlist
)

router.get(
  "/check/:productId",
  authenticate,
  checkWishlist
)

module.exports =
  router