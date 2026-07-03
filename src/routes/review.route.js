const express =
  require("express")

const router =
  express.Router()
  const {createReview,getProductReviews,updateReview,deleteReview,canReviewProduct}= require("../controllers/review.controller")
const authenticate = require("../middlewares/auth.middleware")
router.post(
  "/",
  authenticate,
  createReview
)

router.get(
  "/:productId",
  getProductReviews
)
router.put(

  "/:id",

  authenticate,

  updateReview

)

router.delete(

  "/:id",

  authenticate,

  deleteReview

)
router.get(

  "/can-review/:productId",

  authenticate,

  canReviewProduct
)
module.exports =router