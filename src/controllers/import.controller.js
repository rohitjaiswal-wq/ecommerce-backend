const {
  importProductsService
} = require(
  "../services/import.service"
)

const importProducts =
  async (req, res) => {
console.log("FILE:", req.file)
console.log("BODY:", req.body)
    try {

      if (!req.file) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "CSV file is required"

          })
      }

      const result =
        await importProductsService(
          req.file.buffer
        )

      res.status(200).json({

        success: true,

        ...result

      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      })
    }
}

module.exports = {
  importProducts
}