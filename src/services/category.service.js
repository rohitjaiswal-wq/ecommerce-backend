const prisma =
  require("../prisma/prisma")
const {
  generateId
} = require(
  "../utils/id-generator"
)
const {
  uploadToCloudinary
} = require("./upload.service")
const createCategoryService =
  async (data, file) => {

    const existing =
      await prisma.category.findUnique({
        where: {
          slug: data.slug
        }
      })

    if (existing) {

      throw new Error(
        "Category slug already exists"
      )
    }

    let imageUrl = null

    /*
      CLOUDINARY UPLOAD
    */

    if (file) {

      const uploadedImage =
        await uploadToCloudinary(
          file.buffer
        )

      imageUrl =
        uploadedImage.secure_url
    }

    const category =
      await prisma.category.create({

        data: {
          id:
            generateId("cat"),

          name: data.name,

          slug: data.slug,

          description:
            data.description,

          image: imageUrl
        }
      })

    /*
      ASSIGN PRODUCTS
    */

    if (data.productIds) {

      let productIds = []

      /*
        HANDLE STRINGIFIED JSON
      */

      if (
        typeof data.productIds ===
        "string"
      ) {

        productIds = JSON.parse(
          data.productIds
        )

      } else {

        productIds =
          data.productIds
      }

      /*
        ASSIGN PRODUCTS
      */


      for (const productId of productIds) {

        const exists =
          await prisma.productCategory.findUnique({

            where: {

              productId_categoryId: {

                productId,

                categoryId: category.id

              }

            }

          });

        if (!exists) {

          await prisma.productCategory.create({

            data: {

              productId,

              categoryId: category.id

            }

          });

        }

      }
    }

    return category
  }

const getCategoriesService =
  async () => {

    return await prisma.category.findMany({

      include: {

        products: {

          include: {

            product: true

          }

        },

        children: true

      }
    })
  }

const getCategoryByIdService =
  async (id) => {

    const category =
      await prisma.category.findUnique({

        where: { id },

        include: {
          products: {
            include: {
              product: true
            }
          },
          children: true
        }
      })

    if (!category) {
      throw new Error(
        "Category not found"
      )
    }

    return category
  }

const updateCategoryService =
  async (
    id,
    data,
    file
  ) => {

    const existingCategory =
      await prisma.category.findUnique({
        where: {
          id
        }
      })

    if (!existingCategory) {

      throw new Error(
        "Category not found"
      )
    }

    let imageUrl =
      existingCategory.image

    /*
      CLOUDINARY UPLOAD
    */

    if (file) {

      const uploadedImage =
        await uploadToCloudinary(
          file.buffer
        )

      imageUrl =
        uploadedImage.secure_url
    }

    return await prisma.category.update({

      where: {
        id
      },

      data: {

        name: data.name,

        slug: data.slug,

        description:
          data.description,

        image: imageUrl
      }
    })
  }

const deleteCategoryService =
  async (id) => {

    return await prisma.category.delete({

      where: { id }
    })
  }
const assignProductsToCategoryService =
  async (
    categoryId,
    productIds
  ) => {
console.log("productIds:", productIds);
    const category =
      await prisma.category.findUnique({
        where: {
          id: categoryId
        }
      })

    if (!category) {
      throw new Error(
        "Category not found"
      )
    }

    for (const productId of productIds) {
 console.log("Current productId:", productId);
      const exists =
        await prisma.productCategory.findUnique({

          where: {

            productId_categoryId: {

              productId,

              categoryId

            }

          }

        });

      if (!exists) {

        await prisma.productCategory.create({

          data: {

            productId,

            categoryId

          }

        });

      }

    }

    return true;
  }
const getCategoryBySlugService =
  async (slug) => {

    const category =
      await prisma.category.findUnique({

        where: {
          slug
        },

        include: {

          products: {

            include: {

              product: true

            }

          },

          children: true
        }
      })

    if (!category) {

      throw new Error(
        "Category not found"
      )
    }

    return category
  }
module.exports = {

  createCategoryService,

  getCategoriesService,

  getCategoryByIdService,

  updateCategoryService,

  deleteCategoryService,

  assignProductsToCategoryService,

  getCategoryBySlugService
}