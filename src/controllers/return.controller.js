const {

  createReturnRequestService,

  getReturnRequestsService,
  approveReturnRequestService,
  refundReturnRequestService,
  checkRefundStatusService,
  rejectReturnRequestService

} = require(
  "../services/return.service"
)

const createReturnRequest =
  async (
    req,
    res
  ) => {

    try {

      const request =

        await createReturnRequestService(

          req.body.orderId,

          req.body.reason,

          req.body.note

        )

      res.status(201).json({

        success: true,

        request

      })

    }

    catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message

      })

    }

}

const getReturnRequests =
  async (
    req,
    res
  ) => {

    try {

      const requests =

        await getReturnRequestsService()

      res.status(200).json({

        success: true,

        requests

      })

    }

    catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      })

    }

}
const approveReturnRequest =
  async (
    req,
    res
  ) => {

    try {

      const request =

        await approveReturnRequestService(

          req.params.id

        )

      res.status(200).json({

        success: true,

        request

      })

    }

    catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message

      })

    }

}
const refundReturnRequest =
  async (req, res) => {

    try {

      await refundReturnRequestService(

        req.params.id

      )

      res.status(200).json({

        success: true,

        message:
          "Refund completed successfully"

      })

    }

    catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message

      })

    }

}
const checkRefundStatus =
  async (req, res) => {

    try {

      const result =

        await checkRefundStatusService(

          req.params.id

        );

      res.status(200).json({

        success: true,

        ...result

      });

    }

    catch (error) {

      res.status(400).json({

        success: false,

        message:

          error.message

      });

    }

}
const rejectReturnRequest =
  async (req, res) => {

    try {

      await rejectReturnRequestService(

        req.params.id

      );

      res.status(200).json({

        success: true,

        message:
          "Return rejected successfully"

      });

    }

    catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message

      });

    }

};

module.exports = {

  createReturnRequest,

  getReturnRequests,
  
  approveReturnRequest,
  refundReturnRequest,
  checkRefundStatus,
  rejectReturnRequest

}