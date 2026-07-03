const prisma =
  require("../prisma/prisma")

const {
  generateId
} = require(
  "../utils/id-generator"
)

/*
  ADD TO WISHLIST
*/

const addToWishlistService =
  async (
    userId,
    productId
  ) => {

    const existing =
      await prisma.wishlist.findFirst({

        where: {
          userId,
          productId
        }

      })

    if (existing) {

      throw new Error(
        "Product already in wishlist"
      )
    }

    return await prisma.wishlist.create({

      data: {

        id:
          generateId("wish"),

        userId,

        productId

      }

    })
}

/*
  GET MY WISHLIST
*/

const getWishlistService =
  async (userId) => {

    return await prisma.wishlist.findMany({

      where: {
        userId
      },

      include: {

        product: {

          include: {

            images: true,

            category: true

          }

        }

      },

      orderBy: {

        createdAt:
          "desc"

      }

    })
}

/*
  REMOVE WISHLIST
*/

const removeWishlistService =
  async (
    userId,
    productId
  ) => {

    const wishlist =
      await prisma.wishlist.findFirst({

        where: {

          userId,

          productId

        }

      })

    if (!wishlist) {

      throw new Error(
        "Wishlist item not found"
      )
    }

    await prisma.wishlist.delete({

      where: {
        id: wishlist.id
      }

    })

    return true
}

/*
  CHECK PRODUCT
*/

const checkWishlistService =
  async (
    userId,
    productId
  ) => {

    const wishlist =
      await prisma.wishlist.findFirst({

        where: {

          userId,

          productId

        }

      })

    return !!wishlist
}

module.exports = {

  addToWishlistService,

  getWishlistService,

  removeWishlistService,

  checkWishlistService

}