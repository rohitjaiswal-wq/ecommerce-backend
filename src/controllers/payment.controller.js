const {

  createPaymentSessionService,

  verifyPaymentService

} = require(
  "../services/payment.service"
)

const createPaymentSession =
  async (req, res) => {

    try {

      const result =
        await createPaymentSessionService(

          req.user.id,

          req.body.addressId
        )

      res.status(200).json({

        success: true,

        ...result
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message
      })
    }
}

const paymentReturn =
  async (req, res) => {

    try {

      const payment =
        await verifyPaymentService(

          req.query.orderId
        )

      if (
        payment.status ===
        "CHARGED"
      ) {
console.log(

  "PAYMENT SUCCESS"

)
        return res.redirect(

`${process.env.FRONTEND_URL}/dashboard/orders`

        )
      }

      return res.redirect(

`${process.env.FRONTEND_URL}/checkout?payment=failed`

      )

    } catch (error) {
        console.log(
    "PAYMENT RETURN ERROR:"
  )

  console.log(error)

      return res.redirect(

`${process.env.FRONTEND_URL}/checkout?payment=failed`

      )
    }
}

module.exports = {

  createPaymentSession,

  paymentReturn
}