const prisma = require("../prisma/prisma")
const {
  uploadToCloudinary
} = require("./upload.service")
const {
  redisClient
} = require("../config/redis")
const {
  generateId
} = require(
  "../utils/id-generator"
)
const createProductService =
  async (data, files) => {
    console.log(
      "CREATE DATA:",
      data
    )

    await redisClient.del("products")
    const existingProduct =
      await prisma.product.findUnique({
        where: {
          slug: data.slug
        }
      })

    if (existingProduct) {
      throw new Error(
        "Product slug already exists"
      )
    }

    const uploadedImages = []

    /*
      LOCAL FILE UPLOADS
    */

    if (files?.length > 0) {

      for (const file of files) {

        const result =
          await uploadToCloudinary(
            file.buffer
          )

        uploadedImages.push({

          id:
            generateId("img"),

          url:
            result.secure_url
        })
      }
    }

    /*
      IMAGE URLS
    */

    if (data.imageUrls) {

      let imageUrls = []

      if (
        typeof data.imageUrls ===
        "string"
      ) {
        imageUrls = JSON.parse(
          data.imageUrls
        )
      } else {
        imageUrls = data.imageUrls
      }

      imageUrls.forEach((url) => {
        uploadedImages.push({

          id:
            generateId("img"),

          url
        })
      })
    }

    const product =
      await prisma.product.create({
        data: {
          id:
            generateId("prod"),
          title: data.title,

          slug: data.slug,

          description:
            data.description,

          shortDescription:
            data.shortDescription,

          sku: data.sku,
          weight:
            Number(data.weight) || null,

          length:
            Number(data.length) || null,

          width:
            Number(data.width) || null,

          height:
            Number(data.height) || null,

          metaTitle:
            data.metaTitle || null,

          metaDescription:
            data.metaDescription || null,

          price: Number(data.price) || 0,

          comparePrice:
            Number(
              data.comparePrice
            ) || 0,

          stock: Number(data.stock) || 0,

          status: data.status,

          isFeatured:
            data.isFeatured ===
            "true",

          thumbnail:
            uploadedImages[0]?.url,

          images: {
            create: uploadedImages
          }
        },

        include: {
          images: true
        }
      })

    return product
  }

// const getProductsService = async () => {
//   return await prisma.product.findMany({
//     include: {
//       images: true,
//       category: true
//     }
//   })
// }
const getProductsService =
  async (
    search = "",
    status = "",
    page = 1,
    limit = 10,
    featured = false

  ) => {

    /*
      CHECK REDIS CACHE
    */

    // const cachedProducts =
    //   await redisClient.get(
    //     "products"
    //   )

    // /*
    //   IF CACHE EXISTS
    // */

    // if (cachedProducts) {

    //   console.log(
    //     "Products from Redis"
    //   )

    //   return JSON.parse(
    //     cachedProducts
    //   )
    // }

    /*
      DATABASE QUERY
    */
    const skip =
      (page - 1) * limit
    const totalProducts =
      await prisma.product.count({

        where: {

          AND: [

            status
              ? { status }
              : {},

            featured === "true"
              ? {
                isFeatured: true
              }
              : {},

            {
              OR: [

                {
                  title: {
                    contains: search
                  }
                },

                {
                  sku: {
                    contains: search
                  }
                },

                {
                  slug: {
                    contains: search
                  }
                }

              ]
            }

          ]

        }

      })
    const products =
      await prisma.product.findMany({
        skip,

        take: limit,

        where: {

          AND: [

            status
              ? {
                status: status
              }
              : {},
            featured === "true"
              ? {
                isFeatured: true
              }
              : {},

            {
              OR: [

                {
                  title: {
                    contains: search
                  }
                },

                {
                  sku: {
                    contains: search
                  }
                },

                {
                  slug: {
                    contains: search
                  }
                }

              ]
            }

          ]

        },

        include: {

          images: true,

          category: true,

          inventories: true,

          variants: {

            include: {

              inventories: true

            }

          }

        }
      })

    /*
      SAVE TO REDIS
    */

    // await redisClient.set(

    //   "products",

    //   JSON.stringify(products),

    //   {
    //     EX: 60
    //   }
    // )

    // console.log(
    //   "Products from Database"
    // )

    /*
      FORMAT PRODUCTS
    */

    const formattedProducts =

      products.map(
        (product) => {

          /*
            PRICE
          */

          const minPrice =

            product.variants.length > 0

              ? Math.min(

                ...product.variants.map(
                  (variant) =>
                    variant.price
                )
              )

              : product.price

          /*
            STOCK
          */
          const totalStock =

            product.variants.length > 0

              ?

              product.variants.reduce(

                (
                  total,
                  variant
                ) => {

                  const inventory =

                    variant.inventories?.[0]

                  const available =

                    inventory

                      ?

                      inventory.onHand
                      -
                      inventory.reserved
                      -
                      inventory.damaged
                      -
                      inventory.returnPending

                      :

                      0

                  return total + available

                },

                0

              )

              :

              (

                product.inventories?.[0]

                  ?

                  product.inventories[0].onHand
                  -
                  product.inventories[0].reserved
                  -
                  product.inventories[0].damaged
                  -
                  product.inventories[0].returnPending

                  :

                  0

              )

          return {

            ...product,

            displayPrice:
              minPrice,

            displayStock:
              totalStock
          }
        }
      )

    /*
      SAVE TO REDIS
    */

    // await redisClient.set(

    //   "products",

    //   JSON.stringify(
    //     formattedProducts
    //   ),

    //   {
    //     EX: 60
    //   }
    // )

    return {

      products:
        formattedProducts,

      pagination: {

        total:
          totalProducts,

        page,

        limit,

        totalPages:
          Math.ceil(
            totalProducts / limit
          )

      }

    }
  }
const getAllProductsForCategoryService =
  async () => {

    return await prisma.product.findMany({

      include: {

        images: true,

        category: true,

        variants: true,

        tags: true,

        options: {

          include: {

            values: true
          }
        }
      },

      orderBy: {

        title: "asc"
      }
    })
  }
// const getProductByIdService =
//   async (id) => {
//     const product =
//       await prisma.product.findUnique({
//         where: {
//           id
//         },

//         include: {
//           images: true,
//           category: true,
//           variants: true,
//           tags: true
//         }
//       })

//     if (!product) {
//       throw new Error(
//         "Product not found"
//       )
//     }

//     return product
//   }
const getProductByIdService =
  async (id) => {

    const product =
      await prisma.product.findUnique({

        where: {
          id
        },

        include: {

          images: true,

          category: true,

          tags: true,

          /*
            PRODUCT OPTIONS
          */

          options: {

            include: {

              values: true
            }
          },

          /*
            PRODUCT VARIANTS
          */

          variants: {

            include: {

              inventories: true,

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

          }
        }
      })

    if (!product) {

      throw new Error(
        "Product not found"
      )
    }

    /*
      CALCULATE VARIANT STOCK
    */

    const formattedProduct = {

      ...product,

      variants:

        product.variants.map(

          (variant) => {

            const inventory =

              variant.inventories?.[0]

            const availableStock =

              inventory

                ?

                inventory.onHand
                -
                inventory.reserved
                -
                inventory.damaged
                -
                inventory.returnPending

                :

                0

            return {

              ...variant,

              availableStock

            }

          }

        )

    }

    /*
      CALCULATE TOTAL PRODUCT STOCK
    */

    formattedProduct.availableStock =

      formattedProduct.variants.reduce(

        (total, variant) =>

          total +

          variant.availableStock,

        0

      )

    return formattedProduct
  }
const updateProductService =
  async (id, data, files) => {
    console.log(
      "UPDATE DATA:",
      data
    )
    await redisClient.del("products")

    await redisClient.del(
      `product:${id}`
    )
    if (data.categoryId === "") {
      delete data.categoryId
    }
    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id
        }
      })

    if (!existingProduct) {
      throw new Error(
        "Product not found"
      )
    }

    const updatedProduct =
      await prisma.product.update({
        where: {
          id
        },

        data: {

          title: data.title,

          slug: data.slug,

          description:
            data.description,

          shortDescription:
            data.shortDescription,

          sku: data.sku,
          weight:
            Number(data.weight) || null,

          length:
            Number(data.length) || null,

          width:
            Number(data.width) || null,

          height:
            Number(data.height) || null,

          metaTitle:
            data.metaTitle || null,

          metaDescription:
            data.metaDescription || null,

          status: data.status,

          isFeatured:
            data.isFeatured ===
            "true",

          categoryId:
            data.categoryId || null,
          price:
            Number(data.price) || 0,

          stock:
            Number(data.stock) || 0,
        }
      })
    console.log(
      "UPDATED PRODUCT:",
      updatedProduct
    )
    // if (data.imageUrls) {

    //   const imageUrls =

    //     typeof data.imageUrls === "string"

    //       ? JSON.parse(data.imageUrls)

    //       : data.imageUrls

    //   await prisma.productImage.deleteMany({

    //     where: {
    //       productId: id
    //     }
    //   })

    //   if (imageUrls.length > 0) {

    //     await prisma.productImage.createMany({

    //       data: imageUrls.map(
    //         (url) => ({
    //           id: generateId("img"),
    //           productId: id,
    //           url
    //         })
    //       )
    //     })
    //   }
    // }
    console.log(
      "IMAGE URLS:",
      data.imageUrls
    )
    /*
      UPDATE IMAGE URLS
    */
    const uploadedImages = []

    /*
      LOCAL FILES
    */

    if (files?.length > 0) {

      for (const file of files) {

        const result =
          await uploadToCloudinary(
            file.buffer
          )

        uploadedImages.push({
          id: generateId("img"),
          url: result.secure_url
        })
      }
    }

    /*
      URL IMAGES
    */

    if (data.imageUrls) {

      const imageUrls =

        typeof data.imageUrls ===
          "string"

          ? JSON.parse(
            data.imageUrls
          )

          : data.imageUrls

      imageUrls.forEach((url) => {

        uploadedImages.push({
          id: generateId("img"),
          url
        })

      })
    }

    // if (data.imageUrls) {

    //   const imageUrls =

    //     typeof data.imageUrls === "string"

    //       ? JSON.parse(data.imageUrls)

    //       : data.imageUrls

    //   /*
    //     REMOVE OLD IMAGES
    //   */

    //   await prisma.productImage.deleteMany({

    //     where: {
    //       productId: id
    //     }

    //   })

    //   /*
    //     CREATE NEW IMAGES
    //   */

    //   if (imageUrls.length > 0) {

    //     await prisma.productImage.createMany({

    //       data: imageUrls.map(
    //         (url) => ({
    //  id: generateId("img"),
    //           productId: id,

    //           url

    //         })
    //       )

    //     })

    //     /*
    //       UPDATE THUMBNAIL
    //     */

    //     await prisma.product.update({

    //       where: {
    //         id
    //       },

    //       data: {

    //         thumbnail:
    //           imageUrls[0]

    //       }

    //     })
    //   }
    // }
    if (
      uploadedImages.length > 0
    ) {

      await prisma.productImage.deleteMany({

        where: {
          productId: id
        }

      })

      await prisma.productImage.createMany({

        data:
          uploadedImages.map(
            (image) => ({

              id: image.id,

              productId: id,

              url: image.url
            })
          )
      })

      await prisma.product.update({

        where: {
          id
        },

        data: {

          thumbnail:
            uploadedImages[0].url
        }

      })
    }
    // return updatedProduct
    return await prisma.product.findUnique({

      where: {
        id
      },

      include: {

        images: true,

        category: true,

        variants: true

      }

    })
  }

const deleteProductService =
  async (id) => {
    await redisClient.del("products")

    await redisClient.del(
      `product:${id}`
    )
    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id
        }
      })

    if (!existingProduct) {
      throw new Error(
        "Product not found"
      )
    }

    await prisma.product.delete({
      where: {
        id
      }
    })

    return true
  }
const getProductBySlugService =
  async (slug) => {

    const product =
      await prisma.product.findUnique({

        where: {
          slug
        },

        include: {
          images: true,

          category: true,

          options: {
            include: {
              values: true
            }
          },

          variants: {
            include: {

              inventories: true,

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
          }
        }

      })

    if (!product) {

      throw new Error(
        "Product not found"
      )
    }

    return product
  }
const getRelatedProductsService =
  async (productId) => {

    const productCategories =
      await prisma.productCategory.findMany({

        where: {
          productId
        }

      })

    const categoryIds =
      productCategories.map(
        item => item.categoryId
      )

    if (categoryIds.length === 0) {

      return []

    }

    const related =
      await prisma.productCategory.findMany({

        where: {

          categoryId: {

            in: categoryIds

          },

          NOT: {

            productId

          }

        },

        include: {

          product: {

            include: {

              variants: {

                orderBy: {

                  isDefault: "desc"

                }

              }

            }

          }

        }

      })

    const activeProducts =
      related.filter(

        item =>

          item.product.status === "ACTIVE"

      )

    const uniqueProducts =

      Array.from(

        new Map(

          activeProducts.map(

            item => [

              item.product.id,

              item.product

            ]

          )

        ).values()

      )

    return uniqueProducts.slice(0, 8)

  }
module.exports = {
  createProductService,

  getProductsService,

  getProductByIdService,

  updateProductService,

  deleteProductService,
  getProductBySlugService,
  getAllProductsForCategoryService,
  getRelatedProductsService
}