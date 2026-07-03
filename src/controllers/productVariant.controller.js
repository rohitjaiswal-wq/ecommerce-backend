const {

  generateVariantsService,
  getVariantsService,
  updateVariantService,
  deleteVariantService,
  setDefaultVariantService

} = require(
  "../services/productVariant.service"
)

const generateVariants =
  async (req, res) => {

    try {

      const variants =
        await generateVariantsService(

          req.params.productId
        )

      res.status(201).json({

        success: true,

        message:
          "Variants generated successfully",

        variants
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message
      })
    }
}
const getVariants =
  async (req, res) => {

    try {

      const variants =
        await getVariantsService(

          req.params.productId
        )

      res.status(200).json({

        success: true,

        variants
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message
      })
    }
}
const updateVariant =
  async (req, res) => {

    try {

      const variant =
        await updateVariantService(

          req.params.variantId,

          req.body
        )

      res.status(200).json({

        success: true,

        message:
          "Variant updated successfully",

        variant
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message
      })
    }
}
/*
  DELETE VARIANT
*/

const deleteVariant =
  async (req, res) => {

    try {

      await deleteVariantService(
        req.params.id
      )

      res.status(200).json({

        success: true,

        message:
          "Variant deleted successfully"
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message: error.message
      })
    }
}

/*
  SET DEFAULT VARIANT
*/

const setDefaultVariant =
  async (req, res) => {

    try {

      const variant =

        await setDefaultVariantService(
          req.params.id
        )

      res.status(200).json({

        success: true,

        message:
          "Default variant updated",

        variant
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message
      })
    }
}
module.exports = {

  generateVariants,
  getVariants,
  updateVariant,
  deleteVariant,
  setDefaultVariant
}