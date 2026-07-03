const prisma =
  require("../prisma/prisma")

const getProfileService =
  async (userId) => {

    const user =
      await prisma.user.findUnique({

        where: {
          id: userId
        },

        select: {

          id: true,

          name: true,

          email: true,

          role: true,

          createdAt: true

        }
      })

    if (!user) {

      throw new Error(
        "User not found"
      )
    }

    return user
}
const updateProfileService =
  async (
    userId,
    name
  ) => {

    const user =
      await prisma.user.update({

        where: {
          id: userId
        },

        data: {
          name
        },

        select: {

          id: true,

          name: true,

          email: true,

          role: true,

          createdAt: true
        }
      })

    return user
}
module.exports = {
  getProfileService,
  updateProfileService
}