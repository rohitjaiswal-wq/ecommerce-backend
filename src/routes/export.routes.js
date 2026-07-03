const express =
  require("express")

const router =
  express.Router()

const {
  exportProducts
} = require(
  "../controllers/export.controller"
)

router.get(
  "/products",
  exportProducts
)

module.exports = router