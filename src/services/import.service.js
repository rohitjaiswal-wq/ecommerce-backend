const stream =require("stream")
const csv = require("csv-parser")

const prisma =
  require("../prisma/prisma")
const {
  generateId
} = require(
  "../utils/id-generator"
)
const importProductsService =
  async (fileBuffer) => {

    const rows = []

    await new Promise(
      (resolve, reject) => {

       const readable =
  new stream.Readable()

readable.push(
  fileBuffer
)

readable.push(null)

readable
          .pipe(csv())
          .on(
            "data",
            (row) => {
              rows.push(row)
            }
          )
          .on(
            "end",
            resolve
          )
          .on(
            "error",
            reject
          )
      }
    )

    let created = 0
    let updated = 0

    for (
      const row of rows
    ) {

      const existingProduct =
        await prisma.product.findUnique({
          where: {
            sku: row.sku
          }
        })

      /*
        FIND CATEGORY
      */

      let categoryId = null

      if (
        row.category
      ) {

        const category =
          await prisma.category.findFirst({

            where: {
              name:
                row.category
            }
          })

        categoryId =
          category?.id ||
          null
      }

      /*
        UPDATE
      */

      if (
        existingProduct
      ) {

        await prisma.product.update({

          where: {
            id:
              existingProduct.id
          },

          data: {

            title:
              row.title,

            slug:
              row.slug,

            shortDescription:
              row.shortDescription,

            description:
              row.description,

            price:
              Number(
                row.price
              ),

            comparePrice:
              row.comparePrice
                ? Number(
                    row.comparePrice
                  )
                : null,

            stock:
              Number(
                row.stock
              ),

            status:
              row.status,

            isFeatured:
              row.isFeatured ===
              "true",

            thumbnail:
              row.thumbnail,

            weight:
              row.weight
                ? Number(
                    row.weight
                  )
                : null,

            length:
              row.length
                ? Number(
                    row.length
                  )
                : null,

            width:
              row.width
                ? Number(
                    row.width
                  )
                : null,

            height:
              row.height
                ? Number(
                    row.height
                  )
                : null,

            metaTitle:
              row.metaTitle,

            metaDescription:
              row.metaDescription,

            categoryId
          }
        })

        updated++

      } else {

        /*
          CREATE
        */

        await prisma.product.create({

          data: {
                id:
      generateId("prod"),

            title:
              row.title,

            slug:
              row.slug,

            shortDescription:
              row.shortDescription,

            description:
              row.description,

            sku:
              row.sku,

            price:
              Number(
                row.price
              ),

            comparePrice:
              row.comparePrice
                ? Number(
                    row.comparePrice
                  )
                : null,

            stock:
              Number(
                row.stock
              ),

            status:
              row.status,

            isFeatured:
              row.isFeatured ===
              "true",

            thumbnail:
              row.thumbnail,

            weight:
              row.weight
                ? Number(
                    row.weight
                  )
                : null,

            length:
              row.length
                ? Number(
                    row.length
                  )
                : null,

            width:
              row.width
                ? Number(
                    row.width
                  )
                : null,

            height:
              row.height
                ? Number(
                    row.height
                  )
                : null,

            metaTitle:
              row.metaTitle,

            metaDescription:
              row.metaDescription,

            categoryId
          }
        })

        created++
      }
    }

    return {

      created,

      updated,

      total:
        rows.length
    }
  }

module.exports = {
  importProductsService
}