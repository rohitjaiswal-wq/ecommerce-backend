const { z } = require("zod")

const productStatusEnum = z.enum([
  "DRAFT",
  "ACTIVE",
  "ARCHIVED"
])

const createProductSchema =
  z.object({

    title:
      z.string().min(3),

    slug:
      z.string().min(3),

    description:
      z.string().min(10),

    shortDescription:
      z.string().optional(),

    sku:
      z.string().min(3),

    /*
      SIMPLE PRODUCT
    */

    price:
      z
        .union([
          z.number(),
          z.string()
        ])
        .optional(),

    comparePrice:
      z
        .union([
          z.number(),
          z.string()
        ])
        .optional(),

    stock:
      z
        .union([
          z.number(),
          z.string()
        ])
        .optional(),

    weight:
  z.union([
    z.number(),
    z.string()
  ]).optional(),

length:
  z.union([
    z.number(),
    z.string()
  ]).optional(),

width:
  z.union([
    z.number(),
    z.string()
  ]).optional(),

height:
  z.union([
    z.number(),
    z.string()
  ]).optional(),

metaTitle:
  z.string().optional(),

metaDescription:
  z.string().optional(),
  imageUrls:
  z.union([
    z.string(),
    z.array(z.string())
  ]).optional(),    

    status:
      productStatusEnum,

    isFeatured:
      z
        .union([
          z.boolean(),
          z.string()
        ])
        .optional(),

    thumbnail:
      z.string().optional(),

    categoryId:
      z.string()
        .nullable()
        .optional()
  })

const updateProductSchema =
  createProductSchema.partial()

module.exports = {

  createProductSchema,

  updateProductSchema
}