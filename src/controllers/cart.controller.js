const {

  addToCartService,

  getCartService,

  updateCartItemService,

  deleteCartItemService

} = require(
  "../services/cart.service"
)

const addToCart =
  async (req, res) => {

    try {

      const {

        productId,

        variantId,

        quantity

      } = req.body

      const item =
        await addToCartService(

          req.user.id,

          productId,

          variantId,

          quantity
        )

      res.status(200).json({

        success: true,

        item
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message
      })
    }
}
const getCart =
  async (req, res) => {

    try {

      const cart =
        await getCartService(
          req.user.id
        )

      res.status(200).json({

        success: true,

        cart
      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message
      })
    }
}

const updateCartItem =
  async (req, res) => {

    try {

      const item =
        await updateCartItemService(

          req.params.id,

          req.body.quantity
        )

      res.status(200).json({

        success: true,

        item
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message
      })
    }
}

const deleteCartItem =
  async (req, res) => {

    try {

      await deleteCartItemService(
        req.params.id
      )

      res.status(200).json({

        success: true,

        message:
          "Item removed from cart"
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

  addToCart,

  getCart,

  updateCartItem,

  deleteCartItem
}