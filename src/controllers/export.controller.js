const {
  exportProductsService
} = require(
  "../services/export.service"
)

const exportProducts =
  async (req, res) => {

    try {

      const csv =
        await exportProductsService()

      res.header(
        "Content-Type",
        "text/csv"
      )

      res.attachment(
        "products.csv"
      )

      return res.send(csv)

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      })
    }
}

module.exports = {
  exportProducts
}