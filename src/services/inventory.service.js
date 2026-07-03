const prisma =
  require("../prisma/prisma")

const {
  generateId
} = require(
  "../utils/id-generator"
)

const createInventoryService =
  async (data) => {

    const inventory =
      await prisma.inventory.create({

        data: {

          id:
            generateId("inventory"),

          productId:
            data.productId,

          variantId:
            data.variantId || null,

          warehouse:
            data.warehouse || "MAIN",

          onHand:
            Number(data.onHand),

          reserved: 0,

          damaged: 0,

          returnPending: 0

        }

      })

    /*
      CREATE INITIAL
      INVENTORY TRANSACTION
    */

    await prisma.inventoryTransaction.create({

      data: {

        id:
          generateId("inv"),

        productId:
          data.productId,

        variantId:
          data.variantId || null,

        quantity:
          Number(data.onHand),

        type:
          "STOCK_IN",

        note:
          "Initial Inventory Creation"

      }

    })

    return inventory

}

const reserveInventoryService =
  async (

    inventoryId,

    quantity,

    orderId

  ) => {

    const inventory =

      await prisma.inventory.findUnique({

        where: {

          id:
            inventoryId

        }

      })

    if (!inventory) {

      throw new Error(

        "Inventory not found"

      )
    }

    /*
      AVAILABLE
    */

    const available =

      inventory.onHand

      -

      inventory.reserved

      -

      inventory.damaged

      -

      inventory.returnPending

    if (

      available <

      quantity

    ) {

      throw new Error(

        "Insufficient inventory"

      )
    }

    /*
      UPDATE RESERVED
    */

    await prisma.inventory.update({

      where: {

        id:
          inventoryId

      },

      data: {

        reserved: {

          increment:

            Number(quantity)

        }

      }

    })

    /*
      CREATE RESERVATION
    */

    const reservation =

      await prisma.inventoryReservation.create({

        data: {

          id:

            generateId(

              "res"

            ),

          inventoryId,

          orderId,

          quantity:

            Number(quantity),

          status:

            "ACTIVE"

        }

      })

    return reservation

}

const releaseReservationService =
  async (
    reservationId
  ) => {

    const reservation =

      await prisma.inventoryReservation.findUnique({

        where: {

          id:
            reservationId

        }

      })

    if (!reservation) {

      throw new Error(

        "Reservation not found"

      )
    }

    if (

      reservation.status

      !==

      "ACTIVE"

    ) {

      throw new Error(

        "Reservation already released"

      )
    }

    /*
      REDUCE RESERVED
    */

    await prisma.inventory.update({

      where: {

        id:
          reservation.inventoryId

      },

      data: {

        reserved: {

          decrement:

            reservation.quantity

        }

      }

    })

    /*
      UPDATE STATUS
    */

    const updatedReservation =

      await prisma.inventoryReservation.update({

        where: {

          id:
            reservationId

        },

        data: {

          status:

            "RELEASED"

        }

      })

    return updatedReservation

}
const shipReservationService =
  async (
    reservationId
  ) => {

    const reservation =

      await prisma.inventoryReservation.findUnique({

        where: {

          id:
            reservationId

        },

        include: {

          inventory: true

        }

      })

    if (!reservation) {

      throw new Error(

        "Reservation not found"

      )

    }

    if (

      reservation.status

      !==

      "ACTIVE"

    ) {

      throw new Error(

        "Reservation already processed"

      )

    }

    /*
      UPDATE INVENTORY
    */

    await prisma.inventory.update({

      where: {

        id:

          reservation.inventoryId

      },

      data: {

        onHand: {

          decrement:

            reservation.quantity

        },

        reserved: {

          decrement:

            reservation.quantity

        }

      }

    })

    /*
      UPDATE RESERVATION
    */

    const updatedReservation =

      await prisma.inventoryReservation.update({

        where: {

          id:
            reservationId

        },

        data: {

          status:

            "CONSUMED"

        }

      })

    /*
      INVENTORY HISTORY
    */

    await prisma.inventoryTransaction.create({

      data: {

        id:

          generateId("inv"),

        productId:

          reservation.inventory.productId,

        variantId:

          reservation.inventory.variantId,

        quantity:

          reservation.quantity,

        type:

          "ORDER_DELIVERED",

        note:

          `Reservation ${reservation.id}`

      }

    })

    return updatedReservation

}
const getInventoriesService =
  async () => {

    return await prisma.inventory.findMany({

      include: {

        product: {

          select: {

            id: true,

            title: true,

            thumbnail: true

          }

        },

        variant: {

          select: {

            id: true,

            sku: true

          }

        }

      },

      orderBy: {

        createdAt:

          "desc"

      }

    })

}
const adjustInventoryService =
  async (data) => {
console.log(
  "SERVICE DATA:",
  data
)
    const inventory =

      await prisma.inventory.findUnique({

        where: {

          id:
            data.inventoryId

        }

      })

    if (!inventory) {

      throw new Error(

        "Inventory not found"

      )

    }

    /*
      UPDATE INVENTORY
    */

    let updateData = {}

    if (

      data.type ===

      "STOCK_IN"

    ) {

      updateData = {

        onHand: {

          increment:

            Number(

              data.quantity

            )

        }

      }

    }

    else if (

      data.type ===

      "STOCK_OUT"

    ) {

      if (

        inventory.onHand

        <

        data.quantity

      ) {

        throw new Error(

          "Insufficient stock"

        )

      }

      updateData = {

        onHand: {

          decrement:

            Number(

              data.quantity

            )

        }

      }

    }

    else if (

      data.type ===

      "DAMAGED"

    ) {

      updateData = {

        damaged: {

          increment:

            Number(

              data.quantity

            )

        }

      }

    }

    await prisma.inventory.update({

      where: {

        id:

          data.inventoryId

      },

      data:

        updateData

    })

    /*
      TRANSACTION
    */

    await prisma.inventoryTransaction.create({

      data: {

        id:

          generateId(

            "inv"

          ),

        productId:

          inventory.productId,

        variantId:

          inventory.variantId,

        quantity:

          Number(

            data.quantity

          ),

        type:

          data.type,

        note:

          data.note

      }

    })

    return true

}
const getInventoryByIdService =
  async (id) => {

    const inventory =

      await prisma.inventory.findUnique({

        where: {

          id

        },

        include: {

          product: {

            select: {

              id: true,

              title: true,

              thumbnail: true

            }

          },

          variant: {

            select: {

              id: true,

              sku: true

            }

          }

        }

      })

    if (!inventory) {

      throw new Error(

        "Inventory not found"

      )

    }

    return inventory

}
const getInventoryHistoryService =
  async (inventoryId) => {

    const inventory =
      await prisma.inventory.findUnique({

        where: {
          id: inventoryId
        }

      })

    if (!inventory) {

      throw new Error(
        "Inventory not found"
      )

    }

    let whereClause = {}

    if (inventory.variantId) {

      whereClause = {

        variantId:
          inventory.variantId

      }

    }

    else {

      whereClause = {

        productId:
          inventory.productId,

        variantId:
          null

      }

    }

    return await prisma.inventoryTransaction.findMany({

      where: whereClause,

      orderBy: {

        createdAt:
          "desc"

      }

    })

}
const deleteInventoryService =
  async (id) => {

    const inventory =
      await prisma.inventory.findUnique({

        where: {
          id
        }

      })

    if (!inventory) {

      throw new Error(
        "Inventory not found"
      )

    }

    if (inventory.reserved > 0) {

      throw new Error(
        "Inventory has active reservations"
      )

    }

    if (inventory.onHand > 0) {

      throw new Error(
        "Please reduce stock to 0 before deleting"
      )

    }

await prisma.inventoryReservation.deleteMany({

  where: {
    inventoryId: id
  }

})

/*
  DELETE TRANSACTIONS
*/

const transactions =
  await prisma.inventoryTransaction.findMany({

    where: {

      productId:
        inventory.productId,

      variantId:
        inventory.variantId

    }

  })

console.log(
  "TRANSACTIONS BEFORE DELETE:",
  transactions
)

await prisma.inventoryTransaction.deleteMany({

  where: {

    productId:
      inventory.productId,

    variantId:
      inventory.variantId

  }

})

const remaining =
  await prisma.inventoryTransaction.findMany({

    where: {

      productId:
        inventory.productId,

      variantId:
        inventory.variantId

    }

  })

console.log(
  "TRANSACTIONS AFTER DELETE:",
  remaining
)

await prisma.inventory.delete({

  where: {
    id
  }

})

    return true

}
module.exports = {

  createInventoryService,
  reserveInventoryService,
  releaseReservationService,
  shipReservationService,
  getInventoriesService,
  adjustInventoryService,
  getInventoryByIdService,
  getInventoryHistoryService,
  deleteInventoryService

}