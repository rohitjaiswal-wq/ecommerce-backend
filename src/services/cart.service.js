const prisma =
  require("../prisma/prisma")
const {
  generateId
} = require(
  "../utils/id-generator"
)  

const addToCartService =
  async (
    userId,
    productId,
    variantId,
    quantity
  ) => {

    let cart =
      await prisma.cart.findUnique({

        where: {
          userId
        }
      })

    if (!cart) {

      cart =
        await prisma.cart.create({

          data: {
               id:generateId("cart"),
            userId
          }
        })
    }

    const existingItem =
      await prisma.cartItem.findFirst({

        where: {

          cartId:
            cart.id,

          productId,

          variantId:
            variantId || null
        }
      })

    if (existingItem) {

      return await prisma.cartItem.update({

        where: {
          id:
            existingItem.id
        },

        data: {

          quantity: {

            increment:
              quantity
          }
        }
      })
    }

    return await prisma.cartItem.create({

      data: {
        id:
      generateId("cartitem"),

        cartId:
          cart.id,

        productId,

        variantId:
          variantId || null,

        quantity
      }
    })
}
const getCartService =
  async (userId) => {

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

    return cart
}

const updateCartItemService =
  async (
    itemId,
    quantity
  ) => {

    const item =
      await prisma.cartItem.findUnique({

        where: {
          id: itemId
        }
      })

    if (!item) {

      throw new Error(
        "Cart item not found"
      )
    }

    return await prisma.cartItem.update({

      where: {
        id: itemId
      },

      data: {
        quantity
      }
    })
}

const deleteCartItemService =
  async (itemId) => {

    return await prisma.cartItem.delete({

      where: {
        id: itemId
      }
    })
}
module.exports = {

  addToCartService,

  getCartService,

  updateCartItemService,

  deleteCartItemService
}