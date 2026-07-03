const {

  createInventoryService,
  reserveInventoryService,
  releaseReservationService,
  shipReservationService,
  getInventoriesService,
  adjustInventoryService,
  getInventoryByIdService,
  getInventoryHistoryService,
  deleteInventoryService

} = require(

  "../services/inventory.service"

)

const createInventory =
  async (req, res) => {

    try {

      const inventory =

        await createInventoryService(

          req.body

        )

      res.status(201).json({

        success: true,

        inventory

      })

    }

    catch (error) {

      res.status(400).json({

        success: false,

        message:

          error.message

      })

    }

}
const reserveInventory =
  async (

    req,

    res

  ) => {

    try {

      const reservation =

        await reserveInventoryService(

          req.body.inventoryId,

          req.body.quantity,

          req.body.orderId

        )

      res.status(200).json({

        success: true,

        reservation

      })

    }

    catch (

      error

    ) {

      res.status(400).json({

        success: false,

        message:

          error.message

      })

    }

}
const releaseReservation =
  async (

    req,

    res

  ) => {

    try {

      const reservation =

        await releaseReservationService(

          req.params.id

        )

      res.status(200).json({

        success: true,

        reservation

      })

    }

    catch (

      error

    ) {

      res.status(400).json({

        success: false,

        message:

          error.message

      })

    }

}
const shipReservation =
  async (

    req,

    res

  ) => {

    try {

      const reservation =

        await shipReservationService(

          req.params.id

        )

      res.status(200).json({

        success: true,

        reservation

      })

    }

    catch (

      error

    ) {

      res.status(400).json({

        success: false,

        message:

          error.message

      })

    }

}
const getInventories =
  async (req, res) => {

    try {

      const inventories =

        await getInventoriesService()

      res.status(200).json({

        success: true,

        inventories

      })

    }

    catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      })

    }

}
const adjustInventory =
  async (

    req,

    res

  ) => {

    try {
console.log(
  "REQ BODY:",
  req.body
)
      await adjustInventoryService(

        req.body

      )

      res.status(200).json({

        success: true,

        message:

          "Inventory updated"

      })

    }

    catch (

      error

    ) {

      res.status(400).json({

        success: false,

        message:

          error.message

      })

    }

}
const getInventoryById =
  async (

    req,

    res

  ) => {

    try {

      const inventory =

        await getInventoryByIdService(

          req.params.id

        )

      res.status(200).json({

        success: true,

        inventory

      })

    }

    catch (

      error

    ) {

      res.status(404).json({

        success: false,

        message:

          error.message

      })

    }

}
const getInventoryHistory =
  async (

    req,

    res

  ) => {

    try {

      const history =

        await getInventoryHistoryService(

          req.params.inventoryId

        )

      res.status(200).json({

        success: true,

        history

      })

    }

    catch (error) {

      res.status(500).json({

        success: false,

        message:

          error.message

      })

    }

}
const deleteInventory =
  async (req, res) => {

    try {

      await deleteInventoryService(

        req.params.id

      )

      res.status(200).json({

        success: true,

        message:
          "Inventory deleted"

      })

    }

    catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message

      })

    }

}
module.exports = {

  createInventory,
  reserveInventory,
  releaseReservation,
  shipReservation,
  getInventories,
  adjustInventory,
  getInventoryById,
  getInventoryHistory,
  deleteInventory

}