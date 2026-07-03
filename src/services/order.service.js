const prisma =
  require("../prisma/prisma")
  const {
  generateId
} = require(
  "../utils/id-generator"
)
const {

  shipReservationService

} = require(

  "./inventory.service"

)
const createOrderService =
  async (
    userId,
    addressId
  ) => {
console.log(
      "CREATE ORDER SERVICE HIT"
    )
    const cart =
      await prisma.cart.findUnique({
        

        where: {
          userId
        },

        include: {

          items: {

            include: {

              product: true,

              variant: true
            }
          }
        }
      })
console.log(
  "FULL CART:",
  JSON.stringify(
    cart,
    null,
    2
  )
)
    if (
      !cart ||
      cart.items.length === 0
    ) {

      throw new Error(
        "Cart is empty"
      )
    }

    let totalAmount = 0

 const orderItems = []

for (const item of cart.items) {
  console.log(
  "CART ITEM:",
  {
    productId:
      item.productId,

    variantId:
      item.variantId,

    quantity:
      item.quantity,

    variantStock:
      item.variant?.stock,

    productStock:
      item.product?.stock
  }
)

  /*
    VARIANT PRODUCT
  */

  if (item.variantId) {

    if (
      item.variant.stock <
      item.quantity
    ) {

      throw new Error(

        `${item.product.title} is out of stock`

      )
    }
  }

  /*
    SIMPLE PRODUCT
  */

  else {

    if (
      item.product.stock <
      item.quantity
    ) {

      throw new Error(

        `${item.product.title} is out of stock`

      )
    }
  }

  const price =

    item.variant?.price > 0

      ? item.variant.price

      : item.product.price

  totalAmount +=
    price *
    item.quantity

  orderItems.push({

    id:
      generateId("orditem"),

    productId:
      item.productId,

    variantId:
      item.variantId,

    quantity:
      item.quantity,

    price
  })
}

    const order =
      await prisma.order.create({

        data: {
          id:
        generateId("ord"),

          userId,

          addressId,

          totalAmount,

          items: {

            create:
              orderItems
          }
        },

        include: {
          items: true
        }
      })
    /*
  REDUCE INVENTORY
*/

for (const item of cart.items) {
console.log(
  "REDUCING STOCK:",
  {
    productId:
      item.productId,

    variantId:
      item.variantId,

    quantity:
      item.quantity
  }
)
  /*
    VARIANT PRODUCT
  */

  if (item.variantId) {

    await prisma.productVariant.update({

      where: {
        id:
          item.variantId
      },

      data: {

        stock: {

          decrement:
            item.quantity
        }
      }
    })
    console.log(
  "UPDATED VARIANT:",
  updatedVariant)

    /*
      INVENTORY TRANSACTION
    */

    await prisma.inventoryTransaction.create({

      data: {

        id:
          generateId("inv"),

        productId:
          item.productId,

        variantId:
          item.variantId,

        quantity:
          item.quantity,

        type:
          "ORDER_PLACED",

        note:
          `Order ${order.id}`
      }
    })
  }

  /*
    SIMPLE PRODUCT
  */

  else {

    await prisma.product.update({

      where: {
        id:
          item.productId
      },

      data: {

        stock: {

          decrement:
            item.quantity
        }
      }
    })
console.log(
  "UPDATED PRODUCT:",
  updatedProduct
)
    await prisma.inventoryTransaction.create({

      data: {

        id:
          generateId("inv"),

        productId:
          item.productId,

        quantity:
          item.quantity,

        type:
          "ORDER_PLACED",

        note:
          `Order ${order.id}`
      }
    })
  }
}
    await prisma.cartItem.deleteMany({

      where: {
        cartId:
          cart.id
      }
    })

    return order
}


const getOrdersService =
  async (userId) => {

    return await prisma.order.findMany({

      where: {
        userId
      },

      include: {

        items: {

          include: {

            product: true,

            variant: true
          }
        },

        address: true
      },

      orderBy: {

        createdAt:
          "desc"
      }
    })
}

const getOrderByIdService =
  async (
    orderId,
    userId
  ) => {

    const order =
      await prisma.order.findFirst({

        where: {

          id: orderId,

          userId
        },

        include: {

          items: {

            include: {

              product: true,

              variant: true
            }
          },

          address: true,
          returnRequests: true
        }
      })

    if (!order) {

      throw new Error(
        "Order not found"
      )
    }

    return order
}
const getAllOrdersService =
  async () => {

    return await prisma.order.findMany({

      include: {

        user: {

          select: {

            id: true,

            name: true,

            email: true
          }
        },

        address: true,

        items: {

          include: {

            product: true,

            variant: true
          }
        }
      },

      orderBy: {

        createdAt: "desc"
      }
    })
}
const getAdminOrderByIdService =
  async (orderId) => {

    const order =
      await prisma.order.findUnique({

        where: {
          id: orderId
        },

        include: {

          user: true,

          address: true,

          items: {

            include: {

              product: true,

              variant: true
            }
          },
          returnRequests: true
        }
      })

    if (!order) {

      throw new Error(
        "Order not found"
      )
    }

    return order
}
const updateOrderStatusService =
  async (

    orderId,

    status

  ) => {

    /*
      UPDATE DATA
    */

    const updateData = {

      status

    };

    /*
      SET DELIVERY DATE
      ONLY WHEN DELIVERED
    */

    if (

      status ===
      "DELIVERED"

    ) {

      updateData.deliveredAt =
        new Date();

    }

    const order =

      await prisma.order.update({

        where: {

          id: orderId

        },

        data:

          updateData

      });

    /*
      SHIP INVENTORY
    */

    if (

      status ===
      "SHIPPED"

    ) {

      const reservations =

        await prisma.inventoryReservation.findMany({

          where: {

            orderId,

            status:
              "ACTIVE"

          }

        });

      console.log(

        "RESERVATIONS:",

        reservations

      );

      for (

        const reservation of reservations

      ) {

        await shipReservationService(

          reservation.id

        );

      }

    }

    return order;

  };
module.exports = {

  createOrderService,

  getOrdersService,

  getOrderByIdService,
  getAllOrdersService,
  getAdminOrderByIdService,
  updateOrderStatusService
}