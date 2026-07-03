const prisma =
    require("../prisma/prisma")

const {
  generateId
} = require(
  "../utils/id-generator"
)
/*
  GENERATE COMBINATIONS
*/


const generateCombinations =
  (arrays) => {

    if (!arrays.length) {
      return []
    }

    return arrays.reduce(

      (acc, current) => {

        const result = []

        acc.forEach(
          (accItem) => {

            current.forEach(
              (currentItem) => {

                result.push([
                  ...accItem,
                  currentItem
                ])
              }
            )
          }
        )

        return result
      },

      [[]]
    )
}

/*
  GENERATE VARIANTS
*/

const generateVariantsService =
    async (productId) => {

        /*
          GET PRODUCT OPTIONS
        */

        const options =
            await prisma.productOption.findMany({


                where: {
                    productId
                },

                include: {
                    values: true
                }
            })
        // console.log(
        //   JSON.stringify(options, null, 2)
        // )
        if (!options.length) {

            throw new Error(
                "No product options found"
            )
        }

        /*
          GET VALUES ARRAYS
        */

        const valuesArrays =
            options

                /*
                  REMOVE EMPTY OPTIONS
                */

                .filter(
                    (option) =>
                        option.values.length > 0
                )

                /*
                  GET VALUES
                */

                .map(
                    (option) =>
                        option.values
                )

        /*
  GENERATE COMBINATIONS
*/

const combinations =
  generateCombinations(
    valuesArrays
  )

const createdVariants = []

/*
  CREATE VARIANTS
*/

for (
  const combination of combinations
) {

  /*
    SKU
  */

  const sku =
    combination

      .map(
        (item) =>

          item.value
            .replace(/\s/g, "")
            .toUpperCase()
      )

      .join("-")

  /*
    CREATE VARIANT
  */

  const variant =
    await prisma.productVariant.create({

      data: {
           id:
        generateId("var"),

        sku,

        price: 0,

        stock: 0,

        productId
      }
    })

  /*
    CONNECT OPTION VALUES
  */

  for (
    const value of combination
  ) {

    await prisma.productVariantValue.create({

      data: {
         id:
      generateId("varval"),
        variantId:
          variant.id,

        optionValueId:
          value.id
      }
    })
  }

  createdVariants.push(
    variant
  )
}

return createdVariants
    }

const getVariantsService =
    async (productId) => {

        return await prisma.productVariant.findMany({

            where: {
                productId
            },

            include: {

                values: {

                    include: {

                        optionValue: {

                            include: {
                                option: true
                            }
                        }
                    }
                }
            }
        })
    }
// const updateVariantService =
//     async (
//         variantId,
//         data
//     ) => {

//         return await prisma.productVariant.update({

//             where: {
//                 id: variantId
//             },

//             data: {

//                 sku: data.sku,

//                 price:
//                     Number(data.price),

//                 stock:
//                     Number(data.stock),

//                 image:
//                     data.image
//             }
//         })
//     }
const updateVariantService =
  async (
    variantId,
    data
  ) => {

    /*
      UPDATE VARIANT
    */

    const updatedVariant =
      await prisma.productVariant.update({

        where: {
          id: variantId
        },

        data: {

          sku:
            data.sku,

          price:
            Number(data.price),

          stock:
            Number(data.stock),

          image:
            data.image
        }
      })

    /*
      GET ALL VARIANTS
    */

    const variants =
      await prisma.productVariant.findMany({

        where: {
          productId:
            updatedVariant.productId
        }
      })

    /*
      LOWEST PRICE
    */

    const minPrice =
      Math.min(

        ...variants.map(
          (variant) =>
            variant.price
        )
      )

    /*
      TOTAL STOCK
    */

    const totalStock =
      variants.reduce(

        (
          total,
          variant
        ) =>

          total +
          variant.stock,

        0
      )

    /*
      UPDATE PRODUCT
    */

    await prisma.product.update({

      where: {
        id:
          updatedVariant.productId
      },

      data: {

        price:
          minPrice,

        stock:
          totalStock
      }
    })

    return updatedVariant
}
/*
  DELETE VARIANT
*/

const deleteVariantService =
  async (variantId) => {

    /*
      CHECK VARIANT
    */

    const existingVariant =
      await prisma.productVariant.findUnique({

        where: {
          id: variantId
        }
      })

    if (!existingVariant) {

      throw new Error(
        "Variant not found"
      )
    }

    /*
      DELETE VARIANT
    */

    await prisma.productVariant.delete({

      where: {
        id: variantId
      }
    })

    return true
}
/*
  SET DEFAULT VARIANT
*/

const setDefaultVariantService =
  async (variantId) => {

    /*
      GET VARIANT
    */

    const variant =
      await prisma.productVariant.findUnique({

        where: {
          id: variantId
        }
      })

    if (!variant) {

      throw new Error(
        "Variant not found"
      )
    }

    /*
      RESET ALL VARIANTS
    */

    await prisma.productVariant.updateMany({

      where: {
        productId:
          variant.productId
      },

      data: {
        isDefault: false
      }
    })

    /*
      SET DEFAULT
    */

    const updatedVariant =
      await prisma.productVariant.update({

        where: {
          id: variantId
        },

        data: {
          isDefault: true
        }
      })

    return updatedVariant
}
module.exports = {

    generateVariantsService,
    getVariantsService,
    updateVariantService,
    deleteVariantService,
    setDefaultVariantService
}