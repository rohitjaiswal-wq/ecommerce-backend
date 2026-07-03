const express =
  require("express")

const router =
  express.Router()

const authenticate =
  require(
    "../middlewares/auth.middleware"
  )

const {

  createAddress,

  getAddresses,

  getAddressById,

  updateAddress,

  deleteAddress

} = require(
  "../controllers/address.controller"
)

router.post(
  "/",
  authenticate,
  createAddress
)

router.get(
  "/",
  authenticate,
  getAddresses
)

router.get(
  "/:id",
  authenticate,
  getAddressById
)

router.put(
  "/:id",
  authenticate,
  updateAddress
)

router.delete(
  "/:id",
  authenticate,
  deleteAddress
)

module.exports = router