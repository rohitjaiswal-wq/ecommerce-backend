const prisma =
  require("../prisma/prisma")
const {
  generateId
} = require(
  "../utils/id-generator"
)
const createOptionService =
  async (
    productId,
    data
  ) => {

    /*
      CHECK PRODUCT
    */

    const product =
      await prisma.product.findUnique({

        where: {
          id: productId
        }
      })

    if (!product) {

      throw new Error(
        "Product not found"
      )
    }

    /*
      CREATE OPTION
    */

    return await prisma.productOption.create({

      data: {
        id:
      generateId("opt"),

        name: data.name,

        productId
      }
    })
}

const createOptionValueService =
  async (
    optionId,
    data
  ) => {

    /*
      CHECK OPTION
    */

    const option =
      await prisma.productOption.findUnique({

        where: {
          id: optionId
        }
      })

    if (!option) {

      throw new Error(
        "Option not found"
      )
    }

    /*
      VALIDATE VALUES
    */

    if (
      !data ||
      !data.values
    ) {

      throw new Error(
        "Values are required"
      )
    }

    /*
      CREATE VALUES
    */

    const values =
      data.values.map(
        (value) => ({
          id:
        generateId("optval"),
          value,
          optionId
        })
      )

    return await prisma.productOptionValue.createMany({

      data: values
    })
}

/*
  DELETE OPTION VALUE
*/

const deleteOptionValueService =
  async (valueId) => {

    /*
      CHECK VALUE
    */

    const existingValue =
      await prisma.productOptionValue.findUnique({

        where: {
          id: valueId
        }
      })

    if (!existingValue) {

      throw new Error(
        "Option value not found"
      )
    }

    /*
      DELETE VALUE
    */

    await prisma.productOptionValue.delete({

      where: {
        id: valueId
      }
    })

    return true
}
/*
  DELETE OPTION
*/

const deleteOptionService =
  async (optionId) => {

    /*
      CHECK OPTION
    */

    const existingOption =
      await prisma.productOption.findUnique({

        where: {
          id: optionId
        }
      })

    if (!existingOption) {

      throw new Error(
        "Option not found"
      )
    }

    /*
      DELETE OPTION
    */

    await prisma.productOption.delete({

      where: {
        id: optionId
      }
    })

    return true
}

module.exports = {

  createOptionService,

  createOptionValueService,
  deleteOptionValueService,
  deleteOptionService
}