const {getAllCustomersService, getCustomerByIdService} = require("../services/customer.service")
const getAllCustomers =
  async (req, res) => {

    try {

      const customers =
        await getAllCustomersService()

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


const getCustomerById =
  async (req, res) => {

    try {

      const customer =
        await getCustomerByIdService(
          req.params.id
        )

      return res.status(200).json({

        success: true,

        customer
      })

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message
      })
    }
}

module.exports ={
    getAllCustomers,
    getCustomerById
}