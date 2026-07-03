const {
  getProductAnalytics , getCustomerAnalytics , getOrderAnalytics ,getRevenueAnalytics,getTopSellingProducts,getLowStockProducts,getLatestCustomers,getMonthlyOrderAnalytics,getTopCustomers
} = require(
  "../services/dashboard.service"
)

const getProductsAnalytics =
  async (req, res) => {

    try {

      const analytics =
        await getProductAnalytics()

      res.status(200).json({

        success: true,

        analytics

      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      })
    }
}
const getCustomersAnalytics =
  async (req, res) => {

    try {

      const analytics =
        await getCustomerAnalytics()

      res.status(200).json({

        success: true,

        ...analytics

      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      })
    }
}
const getOrdersAnalytics =
  async (req, res) => {

    try {

      const analytics =
        await getOrderAnalytics()

      res.status(200).json({

        success: true,

        analytics
      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message
      })
    }
}
const getRevenuesAnalytics =
  async (req, res) => {

    try {

      const analytics =
        await getRevenueAnalytics()

      res.status(200).json({

        success: true,

        analytics
      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message
      })
    }
}
const getTopSellingsProducts =
  async (req, res) => {

    try {

      const products =
        await getTopSellingProducts()

      res.status(200).json({

        success: true,

        products
      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message
      })
    }
}
const getLowStocksProducts =
  async (req, res) => {

    try {

      const products =
        await getLowStockProducts()

      res.status(200).json({

        success: true,

        products
      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message
      })
    }
}
const getLatestsCustomers =
  async (req, res) => {

    try {

      const customers =
        await getLatestCustomers()

      return res.status(200).json({

        success: true,

        customers
      })

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message
      })
    }
}
const getMonthlyOrdersAnalytics =
  async (req, res) => {

    try {

      const analytics =
        await getMonthlyOrderAnalytics()

      res.status(200).json({

        success: true,

        analytics
      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message
      })
    }
}
const getTopCustomersController =
  async (req, res) => {

    try {

      const customers =
        await getTopCustomers()

      return res.status(200).json({

        success: true,

        customers
      })

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message
      })
    }
}
module.exports = {
  getProductsAnalytics,
  getCustomersAnalytics,
  getOrdersAnalytics,
  getRevenuesAnalytics,
  getTopSellingsProducts,
  getLowStocksProducts,
  getLatestsCustomers,
  getMonthlyOrdersAnalytics,
  getTopCustomersController
}