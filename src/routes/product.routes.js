const express = require("express")

const router = express.Router()
const upload = require(
  "../middlewares/upload.middleware"
)
const {
  createProduct,

  getProducts,

  getProductById,

  updateProduct,

  deleteProduct,
  getProductBySlug,
  getAllProductsForCategory,
  getRelatedProducts
} = require(
  "../controllers/product.controller"
)

const authenticate = require(
  "../middlewares/auth.middleware"
)

const isAdmin = require(
  "../middlewares/admin.middleware"
)

const validate = require(
  "../middlewares/validate.middleware"
)

const {
  createProductSchema,

  updateProductSchema
} = require(
  "../validations/product.validation"
)

/*
  PUBLIC ROUTES
*/

router.get(
  "/",
  getProducts
)
router.get(
  "/all",
  getAllProductsForCategory
)
router.get(
  "/:id",
  getProductById
)
router.get(
  "/slug/:slug",
  getProductBySlug
)
router.get(

  "/:id/related",

  getRelatedProducts

)
/*
  ADMIN ROUTES
*/

router.post(
  "/",
  authenticate,
  isAdmin,
  upload.array("images", 10),
  createProduct
)

router.put(
  "/:id",
  authenticate,
  isAdmin,
  upload.array("images", 10),
  (req, res, next) => {

  console.log(
    "BODY:",
    req.body
  )
  console.log(
  "FILES:",
  req.files
)

  next()
},
  validate(updateProductSchema),
  updateProduct
)

router.delete(
  "/:id",
  authenticate,
  isAdmin,
  deleteProduct
)

module.exports = router