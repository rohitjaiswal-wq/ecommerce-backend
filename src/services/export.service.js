const prisma =
  require("../prisma/prisma")

const { Parser } =
  require("json2csv")

const exportProductsService =
  async () => {

    const products =
      await prisma.product.findMany({

        include: {

          category: true,

          images: true

        }

      })

    const formattedProducts =

      products.map(
        (product) => ({

          id:
            product.id,

          title:
            product.title,

          slug:
            product.slug,

          shortDescription:
            product.shortDescription,

          description:
            product.description,

          sku:
            product.sku,

          price:
            product.price,

          comparePrice:
            product.comparePrice,

          stock:
            product.stock,

          status:
            product.status,

          isFeatured:
            product.isFeatured,

          thumbnail:
            product.thumbnail,

          weight:
            product.weight,

          length:
            product.length,

          width:
            product.width,

          height:
            product.height,

          metaTitle:
            product.metaTitle,

          metaDescription:
            product.metaDescription,

          category:
            product.category?.name ||
            "",

          images:
            product.images
              .map(
                (image) =>
                  image.url
              )
              .join("|"),

          createdAt:
            product.createdAt,

          updatedAt:
            product.updatedAt

        })
      )

    const parser =
      new Parser()

    return parser.parse(
      formattedProducts
    )
  }

module.exports = {
  exportProductsService
}