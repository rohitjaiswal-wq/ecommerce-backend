const {

  createOptionService,

  createOptionValueService,
  deleteOptionValueService,
  deleteOptionService

} = require(
  "../services/productOption.service"
)

const createOption =
  async (req, res) => {

    try {

      const option =
        await createOptionService(

          req.params.productId,

          req.body
        )

      res.status(201).json({

        success: true,

        message:
          "Option created successfully",

        option
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message: error.message
      })
    }
}

const createOptionValues =
  async (req, res) => {

    try {

      const result =
        await createOptionValueService(

          req.params.optionId,

          req.body
        )

      res.status(201).json({

        success: true,

        message:
          "Option values created successfully",

        result
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message: error.message
      })
    }
}
/*
  DELETE OPTION VALUE
*/

const deleteOptionValue =
  async (req, res) => {

    try {

      await deleteOptionValueService(
        req.params.id
      )

      res.status(200).json({

        success: true,

        message:
          "Option value deleted successfully"
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message: error.message
      })
    }
}


/*
  DELETE OPTION
*/

const deleteOption =
  async (req, res) => {

    try {

      await deleteOptionService(
        req.params.id
      )

      res.status(200).json({

        success: true,

        message:
          "Option deleted successfully"
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message: error.message
      })
    }
}
module.exports = {

  createOption,

  createOptionValues,
  deleteOptionValue,
  deleteOption
}