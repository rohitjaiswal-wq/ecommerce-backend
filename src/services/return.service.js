const prisma =
  require("../prisma/prisma")

const {
  generateId
} = require("../utils/id-generator")
const axios = require("axios")
const qs = require("qs")
const createReturnRequestService =
  async (
    orderId,
    reason,
    note
  ) => {

    /*
      FIND ORDER
    */

    const order =
      await prisma.order.findUnique({

        where: {

          id: orderId

        }

      });

    if (!order) {

      throw new Error(
        "Order not found"
      );

    }

    /*
      ONLY DELIVERED
      ORDERS
    */

    if (

      order.status !==
      "DELIVERED"

    ) {

      throw new Error(
        "Only delivered orders can be returned."
      );

    }

    /*
      DELIVERED DATE
      REQUIRED
    */

    if (!order.deliveredAt) {

      throw new Error(
        "Delivery date not found."
      );

    }

    /*
      7 DAY RETURN POLICY
    */

    const today =

      new Date();

    const deliveredDate =

      new Date(
        order.deliveredAt
      );

    const diffTime =

      today - deliveredDate;

    const diffDays =

      diffTime /

      (1000 * 60 * 60 * 24);

    if (diffDays > 7) {

      throw new Error(
        "Return period has expired."
      );

    }

    /*
      CHECK EXISTING
      RETURN
    */

    const existingReturn =

      await prisma.returnRequest.findFirst({

        where: {

          orderId

        }

      });

    if (existingReturn) {

      throw new Error(
        "Return request already exists for this order."
      );

    }

    /*
      CREATE RETURN
    */

    return await prisma.returnRequest.create({

      data: {

        id:
          generateId("ret"),

        orderId,

        reason,

        note,

        status:
          "REQUESTED"

      }

    });

  };

const getReturnRequestsService =
  async () => {

    return await prisma.returnRequest.findMany({

      include: {

        order: {

          include: {

            user: true

          }

        }

      },

      orderBy: {

        createdAt:
          "desc"

      }

    })

  }
const approveReturnRequestService =
  async (returnId) => {

    const returnRequest =
      await prisma.returnRequest.findUnique({

        where: {
          id: returnId
        }

      })

    if (!returnRequest) {

      throw new Error(
        "Return request not found"
      )

    }

    if (
      returnRequest.status !==
      "REQUESTED"
    ) {

      throw new Error(
        "Return already processed"
      )

    }

    return await prisma.returnRequest.update({

      where: {

        id: returnId

      },

      data: {

        status: "APPROVED",
        approvedAt: new Date()

      }

    })

  }
const refundReturnRequestService =
  async (returnId) => {

    const returnRequest =
      await prisma.returnRequest.findUnique({

        where: {

          id: returnId

        },

        include: {

          order: {

            include: {

              items: true

            }

          }

        }

      })

    if (!returnRequest) {

      throw new Error(
        "Return request not found"
      )

    }

    if (
      returnRequest.status !==
      "APPROVED"
    ) {

      throw new Error(
        "Return request must be approved before refund."
      )

    }

    /*
      RESTOCK INVENTORY
    */

    for (const item of returnRequest.order.items) {

      const inventory =
        await prisma.inventory.findFirst({

          where: {

            productId:
              item.productId,

            variantId:
              item.variantId

          }

        })

      if (!inventory) {

        continue

      }

      await prisma.inventory.update({

        where: {

          id:
            inventory.id

        },

        data: {

          onHand: {

            increment:
              item.quantity

          }

        }

      })

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
            "RETURNED",

          note:
            `Return ${returnRequest.id}`

        }

      })

    }

    /*
      JUSPAY REFUND
    */

    /*
      JUSPAY REFUND
    */

    const authHeader =

      "Basic " +

      Buffer.from(

        process.env.JUSPAY_API_KEY +

        ":"

      ).toString("base64")

    const refundPayload =

      qs.stringify({

        unique_request_id:

          generateId("refund"),

        amount:

          returnRequest.order.totalAmount.toFixed(2),

        metaData:

          JSON.stringify({

            description:

              "Customer Return Refund"

          })

      })

    console.log(

      "REFUND PAYLOAD:",

      refundPayload

    )

    const refundResponse =

      await axios.post(

        `${process.env.JUSPAY_BASE_URL}/orders/${returnRequest.order.paymentOrderId}/refunds`,

        refundPayload,

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
    const refund =

      refundResponse.data.refunds?.[0]

    if (!refund) {

      throw new Error(
        "Refund response not received from Juspay."
      )

    }

    if (

      refund.status !== "PENDING" &&

      refund.status !== "SUCCESS"

    ) {

      throw new Error(

        refund.error_message ||

        "Refund request failed."

      )

    }
    console.log(

      "REFUND RESPONSE:",

      JSON.stringify(

        refundResponse.data,

        null,

        2

      )

    )
    /*
      UPDATE RETURN
    */

    await prisma.returnRequest.update({

      where: {

        id: returnId

      },

      data: {

        status: "REFUND_PENDING",
        refundInitiatedAt: new Date()

      }

    })

    await prisma.order.update({

      where: {

        id: returnRequest.orderId

      },

      data: {

        status: "REFUND_PROCESSING",

        paymentStatus: "REFUND_PENDING",

        refundId: refund.unique_request_id,

        refundAmount: refund.amount

      }

    })

    /*
      UPDATE ORDER
    */

    // await prisma.order.update({

    //   where: {

    //     id: returnRequest.orderId

    //   },

    //   data: {

    //     status: "REFUNDED",

    //     paymentStatus: "REFUNDED",

    //     refundId:

    //       refund.unique_request_id,

    //     refundAmount:

    //       refund.amount

    //   }

    // })

    return true

  }
const checkRefundStatusService =
  async (returnId) => {

    /*
      FIND RETURN REQUEST
    */

    const returnRequest =

      await prisma.returnRequest.findUnique({

        where: {

          id: returnId

        },

        include: {

          order: true

        }

      });

    if (!returnRequest) {

      throw new Error(
        "Return request not found"
      );

    }

    /*
      ONLY CHECK
      REFUND_PENDING
    */

    if (

      returnRequest.status !==
      "REFUND_PENDING"

    ) {

      return {

        status:
          returnRequest.status

      };

    }

    /*
      JUSPAY AUTH
    */

    const authHeader =

      "Basic " +

      Buffer.from(

        process.env.JUSPAY_API_KEY +
        ":"

      ).toString("base64");

    /*
      GET ORDER STATUS
    */

    const response =
      await axios.get(

`${process.env.JUSPAY_BASE_URL}/orders/${returnRequest.order.paymentOrderId}`,

        {

          headers: {

            Authorization:
              authHeader,

            "x-merchantid":
              process.env.JUSPAY_MERCHANT_ID

          }

        }

      );

    const payment =
      response.data;

    /*
      FIND REFUND
    */

    const refund =

      payment.refunds?.find(

        (item) =>

          item.unique_request_id ===

          returnRequest.order.refundId

      );

    /*
      REFUND
      NOT FOUND
    */

    if (!refund) {

      return {

        status:
          "REFUND_PENDING"

      };

    }

    console.log(

      "JUSPAY REFUND STATUS:",

      refund.status

    );

    /*
      SUCCESS
    */

    if (

      refund.status ===
      "SUCCESS"

    ) {

      await prisma.returnRequest.update({

        where: {

          id: returnId

        },

        data: {

          status:
            "REFUNDED",
          refundedAt: new Date()  

        }

      });

      await prisma.order.update({

        where: {

          id: returnRequest.orderId

        },

        data: {

          status:
            "REFUNDED",

          paymentStatus:
            "REFUNDED"

        }

      });

      return {

        status:
          "REFUNDED"

      };

    }

    /*
      STILL PENDING
    */

    return {

      status:
        "REFUND_PENDING"

    };

};

const rejectReturnRequestService =
  async (returnId) => {

    /*
      FIND RETURN
    */

    const returnRequest =
      await prisma.returnRequest.findUnique({

        where: {

          id: returnId

        }

      });

    if (!returnRequest) {

      throw new Error(
        "Return request not found"
      );

    }

    /*
      ONLY REQUESTED
      CAN BE REJECTED
    */

    if (

      returnRequest.status !==
      "REQUESTED"

    ) {

      throw new Error(
        "Only requested returns can be rejected."
      );

    }

    /*
      UPDATE STATUS
    */

    await prisma.returnRequest.update({

      where: {

        id: returnId

      },

      data: {

        status: "REJECTED",
        rejectedAt: new Date()

      }

    });

    return true;

};
module.exports = {

  createReturnRequestService,

  getReturnRequestsService,

  approveReturnRequestService,

  refundReturnRequestService,

  checkRefundStatusService,
  rejectReturnRequestService

}