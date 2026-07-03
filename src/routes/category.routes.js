const express = require("express")

const router = express.Router()
const upload =
  require("../middlewares/upload.middleware")
const {

  createCategory,

  getCategories,

  getCategoryById,

  updateCategory,

  deleteCategory,

  assignProductsToCategory,

  getCategoryBySlug

} = require("../controllers/category.controller")

const authenticate =
  require("../middlewares/auth.middleware")

const isAdmin =
  require("../middlewares/admin.middleware")
 

router.post(
  "/",
  authenticate,
  isAdmin,
   upload.single("image"),
  createCategory
)

router.get(
  "/",
  getCategories
)
router.get(
  "/slug/:slug",
  getCategoryBySlug
)
router.get(
  "/:id",
  getCategoryById
)


router.put(
  "/:id",
  authenticate,
  isAdmin,
   upload.single("image"),
  updateCategory
)

router.delete(
  "/:id",
  authenticate,
  isAdmin,
  deleteCategory
)
router.put(
  "/:id/assign-products",

  authenticate,

  isAdmin,

  assignProductsToCategory
)
module.exports = router