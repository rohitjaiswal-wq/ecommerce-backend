const express =
  require("express")

const router =
  express.Router()

const upload =
  require(
    "../middlewares/upload.middleware"
  )

const {
  importProducts
} = require(
  "../controllers/import.controller"
)

router.post(
  "/products",
  upload.single("file"),
  importProducts
)

module.exports = router