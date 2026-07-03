const {

  addToWishlistService,

  getWishlistService,

  removeWishlistService,

  checkWishlistService

} = require(
  "../services/wishlist.service"
)

const addToWishlist =
  async (req, res) => {

    try {

      const wishlist =

        await addToWishlistService(

          req.user.id,

          req.body.productId

        )

      res.status(201).json({

        success: true,

        wishlist

      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message

      })
    }
}

const getWishlist =
  async (req, res) => {

    try {

      const wishlist =

        await getWishlistService(
          req.user.id
        )

      res.status(200).json({

        success: true,

        wishlist

      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      })
    }
}

const removeWishlist =
  async (req, res) => {

    try {

      await removeWishlistService(

        req.user.id,

        req.params.productId

      )

      res.status(200).json({

        success: true,

        message:
          "Removed from wishlist"

      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message

      })
    }
}

const checkWishlist =
  async (req, res) => {

    try {

      const inWishlist =

        await checkWishlistService(

          req.user.id,

          req.params.productId

        )

      res.status(200).json({

        success: true,

        inWishlist

      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      })
    }
}

module.exports = {

  addToWishlist,

  getWishlist,

  removeWishlist,

  checkWishlist

}