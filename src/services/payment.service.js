const axios =
  require("axios")

const qs =
  require("qs")

const prisma =
  require("../prisma/prisma")
const {
  generateId
} = require(
  "../utils/id-generator"
)
const {

  reserveInventoryService

} = require(

  "./inventory.service"

)
const createPaymentSessionService =
  async (
    userId,
    addressId
  ) => {

    /*
      FIND CART
    */

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

    if (
      !cart ||
      cart.items.length === 0
    ) {

      throw new Error(
        "Cart is empty"
      )
    }

    /*
      CALCULATE TOTAL
    */

    let totalAmount = 0

    for (
      const item of cart.items
    ) {

      const price =

        item.variant?.price > 0

          ? item.variant.price

          : item.product.price

      totalAmount +=
        price *
        item.quantity
    }

    /*
      CREATE ORDER
    */

    const order =
      await prisma.order.create({

        data: {
           id:
        generateId("ord"),  

          userId,

          addressId,

          totalAmount,

          status:
            "PENDING_PAYMENT"
        }
      })

    /*
      JUSPAY ORDER ID
    */

    const paymentOrderId =

       order.id

    /*
      FIND USER
    */

    const user =
      await prisma.user.findUnique({

        where: {
          id: userId
        }
      })

    const payload = {

      order_id:
        paymentOrderId,

      amount:
        totalAmount.toFixed(2),

      currency:
        "INR",

      customer_id:
        user.id,

      customer_email:
        user.email,

      customer_phone:
        "9999999999",

      return_url:

`${process.env.BACKEND_URL}/api/payment/return?orderId=${order.id}`,

      "options.get_client_auth_token":
        "true"
    }

    const authHeader =

      "Basic " +

      Buffer.from(

        process.env.JUSPAY_API_KEY +

        ":"

      ).toString("base64")

    const response =
      await axios.post(

        `${process.env.JUSPAY_BASE_URL}/orders`,

        qs.stringify(payload),

        {

          headers: {

            Authorization:
              authHeader,

            "x-merchantid":
              process.env.JUSPAY_MERCHANT_ID,

            "x-routing-id":
              process.env.JUSPAY_ROUTING_ID,

            "Content-Type":

              "application/x-www-form-urlencoded"
          }
        }
      )

    await prisma.order.update({

      where: {
        id: order.id
      },

      data: {

        paymentOrderId
      }
    })

    return {

      orderId:
        order.id,

      juspay:
        response.data
    }
}

const verifyPaymentService =
  async (
    orderId
  ) => {

    const order =
      await prisma.order.findUnique({

        where: {
          id: orderId
        }
      })

    if (!order) {

      throw new Error(
        "Order not found"
      )
    }

    const authHeader =

      "Basic " +

      Buffer.from(

        process.env.JUSPAY_API_KEY +

        ":"

      ).toString("base64")

    const response =
      await axios.get(

`${process.env.JUSPAY_BASE_URL}/orders/${order.paymentOrderId}`,

        {

          headers: {

            Authorization:
              authHeader,

            "x-merchantid":
              process.env.JUSPAY_MERCHANT_ID
          }
        }
      )

    const payment =
      response.data
      console.log(

  "PAYMENT RESPONSE:",

  JSON.stringify(
    payment,
    null,
    2
  )

)

    if (
      payment.status ===
      "CHARGED"
    ) {
console.log(

  "PAYMENT SUCCESS"

)
      await prisma.order.update({

        where: {
          id: order.id
        },

        data: {

          status:
            "PENDING",

          paymentStatus:
            payment.status,

          paymentMethod:
            payment.payment_method
        }
      })

      /*
        MOVE CART ITEMS
        TO ORDER ITEMS
      */


const cart =
  await prisma.cart.findUnique({

    where: {

      userId:
        order.userId

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

  for (

const item of cart.items

) {

await prisma.orderItem.create({

data: {

id:

generateId(

"orditem"

),

orderId:

order.id,

productId:

item.productId,

variantId:

item.variantId,

quantity:

item.quantity,

price:

item.variant?.price > 0

?

item.variant.price

:

item.product.price

}

})


console.log(

"ITEM:",

item

)

const inventory =

await prisma.inventory.findFirst({

where: {

productId:

item.productId,

// variantId:

// item.variantId || null

}

})

console.log(

"FOUND INVENTORY:",

inventory

)

if (

!inventory

) {

throw new Error(

"Inventory not found"

)

}


await reserveInventoryService(

inventory.id,

item.quantity,

order.id

)

}

      await prisma.cartItem.deleteMany({

        where: {

          cartId:
            cart.id
        }
      })
    }

    return payment
}

module.exports = {

  createPaymentSessionService,

  verifyPaymentService
}