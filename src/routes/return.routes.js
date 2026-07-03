const express =
  require("express")

const router =
  express.Router()

const authenticate =
  require(
    "../middlewares/auth.middleware"
  )

const {

  createReturnRequest,

  getReturnRequests,
  approveReturnRequest,
  refundReturnRequest,
  checkRefundStatus,
  rejectReturnRequest

} = require(
  "../controllers/return.controller"
)

router.post(
  "/",
  authenticate,
  createReturnRequest
)

router.get(
  "/",
  authenticate,
  getReturnRequests
)
router.put(
  "/approve/:id",
  authenticate,
  approveReturnRequest
)

router.put("/refund/:id" , authenticate,refundReturnRequest)
router.get(

  "/check-status/:id",

  authenticate,
  checkRefundStatus

);

router.put(

  "/reject/:id",

  authenticate,
  rejectReturnRequest

);
module.exports =router