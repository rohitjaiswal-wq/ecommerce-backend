const express =
  require("express")

const router =
  express.Router()

const {
  getProductsAnalytics,
  getCustomersAnalytics,
  getOrdersAnalytics,
  getRevenuesAnalytics,
  getTopSellingsProducts,
  getLowStocksProducts,
  getLatestsCustomers,
  getMonthlyOrdersAnalytics,
  getTopCustomersController
} = require(
  "../controllers/dashboard.controller"
)

router.get(
  "/products",
  getProductsAnalytics
)
router.get(
  "/customers",
  getCustomersAnalytics
)
router.get(
  "/orders",
  getOrdersAnalytics
)
router.get(
  "/revenue",
  getRevenuesAnalytics
)
router.get(
  "/top-products",
  getTopSellingsProducts
)
router.get(
  "/low-stock",
  getLowStocksProducts
)
router.get(
  "/latest-customers",
  getLatestsCustomers
)
router.get(
  "/monthly-orders",
  getMonthlyOrdersAnalytics
)
router.get(
  "/top-customers",
  getTopCustomersController
)
module.exports = router