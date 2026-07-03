const prisma = require("../prisma/prisma")
const getAllCustomersService =
  async () => {

    const customers =
      await prisma.user.findMany({

        where: {
          role: "USER"
        },

        include: {

          orders: true
        },

        orderBy: {

          createdAt: "desc"
        }
      })

    return customers.map(
      (customer) => ({

        id: customer.id,

        name: customer.name,

        email: customer.email,

        createdAt:
          customer.createdAt,

        totalOrders:
          customer.orders.length,

        totalSpent:

          customer.orders.reduce(

            (sum, order) =>

              sum +
              order.totalAmount,

            0
          )
      })
    )
}
const getCustomerByIdService =
  async (id) => {

    const customer =
      await prisma.user.findUnique({

        where: {
          id
        },

        include: {

          addresses: true,

          orders: {

            include: {

              items: {

                include: {

                  product: true,

                  variant: true
                }
              }
            },

            orderBy: {
              createdAt: "desc"
            }
          }
        }
      })

    if (!customer) {

      throw new Error(
        "Customer not found"
      )
    }

    return customer
}
module.exports={
    getAllCustomersService,
    getCustomerByIdService
}