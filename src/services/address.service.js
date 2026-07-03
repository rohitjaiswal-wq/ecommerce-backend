const prisma =
  require("../prisma/prisma")
const {
  generateId
} = require(
  "../utils/id-generator"
)
const createAddressService =
  async (
    userId,
    data
  ) => {
if (data.isDefault) {

  await prisma.address.updateMany({

    where: {
      userId
    },

    data: {
      isDefault: false
    }

  })
}
    const address =
      await prisma.address.create({

        data: {
           id:
        generateId("addr"),

          ...data,

          userId

        }

      })

    return address
}

const getAddressesService =
  async (userId) => {

    return await prisma.address.findMany({

      where: {
        userId
      },

      orderBy: {
        createdAt: "desc"
      }

    })
}

const getAddressByIdService =
  async (
    id,
    userId
  ) => {

    const address =
      await prisma.address.findFirst({

        where: {
          id,
          userId
        }

      })

    if (!address) {

      throw new Error(
        "Address not found"
      )
    }

    return address
}

const updateAddressService =
  async (
    id,
    userId,
    data
  ) => {

    const address =
      await prisma.address.findFirst({

        where: {
          id,
          userId
        }

      })

    if (!address) {

      throw new Error(
        "Address not found"
      )
    }
    if (data.isDefault) {

  await prisma.address.updateMany({

    where: {
      userId
    },

    data: {
      isDefault: false
    }

  })
}

    return await prisma.address.update({

      where: {
        id
      },

      data

    })
}

const deleteAddressService =
  async (
    id,
    userId
  ) => {

    const address =
      await prisma.address.findFirst({

        where: {
          id,
          userId
        }

      })

    if (!address) {

      throw new Error(
        "Address not found"
      )
    }

    await prisma.address.delete({

      where: {
        id
      }

    })
}

module.exports = {

  createAddressService,

  getAddressesService,

  getAddressByIdService,

  updateAddressService,

  deleteAddressService

}