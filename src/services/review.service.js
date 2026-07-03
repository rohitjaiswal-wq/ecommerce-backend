const prisma =
  require("../prisma/prisma")

const {
  generateId
} = require(
  "../utils/id-generator"
)

const createReviewService =
  async (
    userId,
    productId,
    rating,
    comment
  ) => {
console.log("USER ID:", userId)
console.log("PRODUCT ID:", productId)

    /*
      CHECK PURCHASE
    */

    const purchased =
      await prisma.orderItem.findFirst({

        where: {

          productId,

          order: {

            userId,

            status:
              "DELIVERED"
          }
        }
      })
console.log("PURCHASED:", purchased)
    if (!purchased) {

      throw new Error(
        "You can review only purchased products"
      )
    }

    /*
      CHECK EXISTING REVIEW
    */

    const existingReview =
      await prisma.review.findFirst({

        where: {

          userId,

          productId
        }
      })

    if (existingReview) {

      throw new Error(
        "Review already submitted"
      )
    }

    return await prisma.review.create({

      data: {

        id:
          generateId("rev"),

        rating,

        comment,

        userId,

        productId
      }
    })
}




const getProductReviewsService =
  async (productId) => {

    return await prisma.review.findMany({

      where: {
        productId
      },

      include: {

        user: {

          select: {

            id: true,

            name: true
          }
        }
      },

      orderBy: {

        createdAt:
          "desc"
      }
    })
}

const updateReviewService =
  async (
    reviewId,
    userId,
    rating,
    comment
  ) => {

    const review =
      await prisma.review.findUnique({

        where: {
          id: reviewId
        }

      })

    if (!review) {

      throw new Error(
        "Review not found"
      )
    }

    if (
      review.userId !== userId
    ) {

      throw new Error(
        "Unauthorized"
      )
    }

    return await prisma.review.update({

      where: {
        id: reviewId
      },

      data: {

        rating,

        comment

      }

    })
}
const deleteReviewService =
  async (
    reviewId,
    userId
  ) => {

    const review =
      await prisma.review.findUnique({

        where: {
          id: reviewId
        }

      })

    if (!review) {

      throw new Error(
        "Review not found"
      )
    }

    if (
      review.userId !== userId
    ) {

      throw new Error(
        "Unauthorized"
      )
    }

    await prisma.review.delete({

      where: {
        id: reviewId
      }

    })

    return true
}
const canReviewProductService =
  async (
    userId,
    productId
  ) => {

    const purchased =
      await prisma.orderItem.findFirst({

        where: {

          productId,

          order: {

            userId,

            status:
              "DELIVERED"
          }
        }
      })

    return !!purchased
}
module.exports={
    createReviewService,
    getProductReviewsService,
    updateReviewService,
    deleteReviewService ,
    canReviewProductService
}