const {

  createAddressService,

  getAddressesService,

  getAddressByIdService,

  updateAddressService,

  deleteAddressService

} = require(
  "../services/address.service"
)

const createAddress =
  async (req, res) => {

    try {

      const address =
        await createAddressService(

          req.user.id,

          req.body

        )

      res.status(201).json({

        success: true,

        address

      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message

      })
    }
}

const getAddresses =
  async (req, res) => {

    try {

      const addresses =
        await getAddressesService(
          req.user.id
        )

      res.status(200).json({

        success: true,

        addresses

      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      })
    }
}

const getAddressById =
  async (req, res) => {

    try {

      const address =
        await getAddressByIdService(

          req.params.id,

          req.user.id

        )

      res.status(200).json({

        success: true,

        address

      })

    } catch (error) {

      res.status(404).json({

        success: false,

        message:
          error.message

      })
    }
}

const updateAddress =
  async (req, res) => {

    try {

      const address =
        await updateAddressService(

          req.params.id,

          req.user.id,

          req.body

        )

      res.status(200).json({

        success: true,

        address

      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message

      })
    }
}

const deleteAddress =
  async (req, res) => {

    try {

      await deleteAddressService(

        req.params.id,

        req.user.id

      )

      res.status(200).json({

        success: true,

        message:
          "Address deleted successfully"

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

  createAddress,

  getAddresses,

  getAddressById,

  updateAddress,

  deleteAddress

}