const express =
  require("express")

const router =
  express.Router()

const {

  generateVariants,
  getVariants,
  updateVariant,
  deleteVariant,
  setDefaultVariant

} = require(
  "../controllers/productVariant.controller"
)

const authenticate =
  require("../middlewares/auth.middleware")

const isAdmin =
  require("../middlewares/admin.middleware")

router.post(

  "/generate/:productId",

  authenticate,

  isAdmin,

  generateVariants
)
router.get(
  "/:productId",
  getVariants
)
router.put(

  "/:variantId",

  authenticate,

  isAdmin,

  updateVariant
)

router.delete(

  "/:id",

  authenticate,

  isAdmin,

  deleteVariant
)
router.put(

  "/default/:id",

  authenticate,

  isAdmin,

  setDefaultVariant
)
module.exports = router