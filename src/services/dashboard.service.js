const prisma =
  require("../prisma/prisma")

const getProductAnalytics =
  async () => {

    const totalProducts =
      await prisma.product.count()

    const activeProducts =
      await prisma.product.count({
        where: {
          status: "ACTIVE"
        }
      })

    const draftProducts =
      await prisma.product.count({
        where: {
          status: "DRAFT"
        }
      })

    const archivedProducts =
      await prisma.product.count({
        where: {
          status: "ARCHIVED"
        }
      })

    const outOfStockProducts =
      await prisma.product.count({
        where: {
          stock: 0
        }
      })

    return {

      totalProducts,

      activeProducts,

      draftProducts,

      archivedProducts,

      outOfStockProducts

    }
}

const getCustomerAnalytics =
  async () => {

    const totalCustomers =
      await prisma.user.count({
        where: {
          role: "USER"
        }
      })

    const customers =
      await prisma.user.findMany({

        where: {
          role: "USER"
        },

        select: {

          id: true,

          name: true,

          email: true,

          createdAt: true

        },

        orderBy: {

          createdAt: "desc"

        }

      })

    return {

      totalCustomers,

      customers

    }
}
const getOrderAnalytics =
  async () => {

    const totalOrders =
      await prisma.order.count()

    const pendingPaymentOrders =
      await prisma.order.count({
        where: {
          status: "PENDING_PAYMENT"
        }
      })

    const pendingOrders =
      await prisma.order.count({
        where: {
          status: "PENDING"
        }
      })

    const processingOrders =
      await prisma.order.count({
        where: {
          status: "PROCESSING"
        }
      })

    const shippedOrders =
      await prisma.order.count({
        where: {
          status: "SHIPPED"
        }
      })

    const deliveredOrders =
      await prisma.order.count({
        where: {
          status: "DELIVERED"
        }
      })

    const cancelledOrders =
      await prisma.order.count({
        where: {
          status: "CANCELLED"
        }
      })

    const revenue =
      await prisma.order.aggregate({

        where: {
          status: {
            not: "CANCELLED"
          }
        },

        _sum: {
          totalAmount: true
        }
      })

    const recentOrders =
      await prisma.order.findMany({

        take: 10,

        orderBy: {
          createdAt: "desc"
        },

        include: {

          user: {

            select: {

              name: true,

              email: true
            }
          }
        }
      })

    return {

      totalOrders,

      pendingPaymentOrders,

      pendingOrders,

      processingOrders,

      shippedOrders,

      deliveredOrders,

      cancelledOrders,

      totalRevenue:
        revenue._sum
          .totalAmount || 0,

      recentOrders
    }
}
const getRevenueAnalytics =
  async () => {

    const now =
      new Date()

    const startOfToday =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      )

    const startOfMonth =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )

    const totalRevenue =
      await prisma.order.aggregate({

        where: {
          status: {
            not: "CANCELLED"
          }
        },

        _sum: {
          totalAmount: true
        }
      })

    const todayRevenue =
      await prisma.order.aggregate({

        where: {

          status: {
            not: "CANCELLED"
          },

          createdAt: {
            gte: startOfToday
          }
        },

        _sum: {
          totalAmount: true
        }
      })

    const monthlyRevenue =
      await prisma.order.aggregate({

        where: {

          status: {
            not: "CANCELLED"
          },

          createdAt: {
            gte: startOfMonth
          }
        },

        _sum: {
          totalAmount: true
        }
      })

    return {

      totalRevenue:
        totalRevenue._sum.totalAmount || 0,

      todayRevenue:
        todayRevenue._sum.totalAmount || 0,

      monthlyRevenue:
        monthlyRevenue._sum.totalAmount || 0
    }
}
const getTopSellingProducts =
  async () => {

    const products =
      await prisma.orderItem.groupBy({

        by: ["productId"],

        _sum: {
          quantity: true
        },

        orderBy: {

          _sum: {
            quantity: "desc"
          }
        },

        take: 5
      })

    const result =
      await Promise.all(

        products.map(
          async (item) => {

            const product =
              await prisma.product.findUnique({

                where: {
                  id: item.productId
                },

                select: {

                  id: true,

                  title: true,

                  thumbnail: true,

                  price: true
                }
              })

            return {

              ...product,

              soldQuantity:
                item._sum.quantity || 0,

              revenue:
                (item._sum.quantity || 0) *
                (product?.price || 0)
            }
          }
        )
      )

    return result
}
const getLowStockProducts =
  async () => {

    return await prisma.product.findMany({

      where: {

        stock: {

          gt: 0,

          lte: 5
        }
      },

      select: {

        id: true,

        title: true,

        thumbnail: true,

        stock: true,

        price: true
      },

      orderBy: {

        stock: "asc"
      },

      take: 10
    })
}
const getLatestCustomers =
  async () => {

    return await prisma.user.findMany({

      where: {
        role: "USER"
      },

      select: {

        id: true,

        name: true,

        email: true,

        createdAt: true
      },

      orderBy: {

        createdAt: "desc"
      },

      take: 10
    })
}
const getMonthlyOrderAnalytics =
  async () => {

    const currentYear =
      new Date().getFullYear()

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ]

    const result = []

    for (
      let month = 0;
      month < 12;
      month++
    ) {

      const startDate =
        new Date(
          currentYear,
          month,
          1
        )

      const endDate =
        new Date(
          currentYear,
          month + 1,
          1
        )

      const count =
        await prisma.order.count({

          where: {

            createdAt: {

              gte: startDate,

              lt: endDate
            }
          }
        })

      result.push({

        month:
          months[month],

        orders:
          count
      })
    }

    return result
}
const getTopCustomers =
  async () => {

    const customers =
      await prisma.user.findMany({

        where: {
          role: "USER"
        },

        include: {
          orders: true
        }
      })

    return customers
      .map((customer) => {

        const totalOrders =
          customer.orders.length

        const totalSpent =
          customer.orders.reduce(

            (sum, order) =>

              sum +
              order.totalAmount,

            0
          )

        return {

          id: customer.id,

          name: customer.name,

          email: customer.email,

          totalOrders,

          totalSpent
        }
      })

      .sort(
        (a, b) =>
          b.totalSpent -
          a.totalSpent
      )

      .slice(0, 10)
}
module.exports = {
  getProductAnalytics,
  getCustomerAnalytics,
  getOrderAnalytics,
  getRevenueAnalytics,
  getTopSellingProducts,
  getLowStockProducts,
  getLatestCustomers,
  getMonthlyOrderAnalytics,
  getTopCustomers
}