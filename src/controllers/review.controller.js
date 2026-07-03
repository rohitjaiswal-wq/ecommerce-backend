const{ createReviewService,
    getProductReviewsService,updateReviewService,deleteReviewService,canReviewProductService} = require("../services/review.service")
const createReview =
  async (req, res) => {

    try {

      const review =

        await createReviewService(

          req.user.id,

          req.body.productId,

          req.body.rating,

          req.body.comment
        )

      res.status(201).json({

        success: true,

        review
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message
      })
    }
}

const getProductReviews =
  async (req, res) => {

    try {

      const reviews =

        await getProductReviewsService(
          req.params.productId
        )

      res.status(200).json({

        success: true,

        reviews
      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message
      })
    }
}
const updateReview =
  async (req, res) => {

    try {

      const review =

        await updateReviewService(

          req.params.id,

          req.user.id,

          req.body.rating,

          req.body.comment

        )

      res.status(200).json({

        success: true,

        review

      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message

      })
    }
}
const deleteReview =
  async (req, res) => {

    try {

      await deleteReviewService(

        req.params.id,

        req.user.id

      )

      res.status(200).json({

        success: true,

        message:
          "Review deleted successfully"

      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message

      })
    }
}

const canReviewProduct =
  async (req, res) => {

    try {

      const canReview =

        await canReviewProductService(

          req.user.id,

          req.params.productId
        )

      res.status(200).json({

        success: true,

        canReview
      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message
      })
    }
}
module.exports={
createReview,    
getProductReviews,
updateReview,
deleteReview,
canReviewProduct
}