const express =
  require("express")

const router =
  express.Router()

const authenticate =
  require(
    "../middlewares/auth.middleware"
  )

const {

  createPaymentSession,

  paymentReturn

} = require(
  "../controllers/payment.controller"
)

router.post(
  "/create-session",
  authenticate,
  createPaymentSession
)

router.get(
  "/return",
  paymentReturn
)

module.exports = router