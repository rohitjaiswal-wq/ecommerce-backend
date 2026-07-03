const {

  createOrderService,

  getOrdersService,

  getOrderByIdService,
  getAllOrdersService,
  getAdminOrderByIdService,
  updateOrderStatusService

} = require(
  "../services/order.service"
)

const createOrder =
  async (req, res) => {
console.log(
  "CREATE ORDER CONTROLLER HIT"
)
    try {

      const order =
        await createOrderService(

          req.user.id,

          req.body.addressId
        )

      res.status(201).json({

        success: true,

        order
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message
      })
    }
}

const getOrders =
  async (req, res) => {

    try {

      const orders =
        await getOrdersService(
          req.user.id
        )

      res.status(200).json({

        success: true,

        orders
      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message
      })
    }
}

const getOrderById =
  async (req, res) => {

    try {

      const order =
        await getOrderByIdService(

          req.params.id,

          req.user.id
        )

      res.status(200).json({

        success: true,

        order
      })

    } catch (error) {

      res.status(404).json({

        success: false,

        message:
          error.message
      })
    }
}

const getAllOrders =
  async (req, res) => {

    try {

      const orders =
        await getAllOrdersService()

      res.status(200).json({

        success: true,

        orders
      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message
      })
    }
}
const getAdminOrderById =
  async (req, res) => {

    try {

      const order =
        await getAdminOrderByIdService(
          req.params.id
        )

      res.status(200).json({

        success: true,

        order
      })

    } catch (error) {

      res.status(404).json({

        success: false,

        message:
          error.message
      })
    }
}
const updateOrderStatus =
  async (req, res) => {

    try {

      const order =
        await updateOrderStatusService(

          req.params.id,

          req.body.status
        )

      res.status(200).json({

        success: true,

        message:
          "Order status updated",

        order
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

  createOrder,

  getOrders,

  getOrderById,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus
}