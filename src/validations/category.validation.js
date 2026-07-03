const z = require("zod")

const createCategorySchema =
  z.object({

    name: z.string()
      .min(2),

    slug: z.string()
      .min(2),

    description:
      z.string().optional(),

    image:
      z.string().optional(),

    parentId:
      z.string().optional(),

    productIds:
     z.any().optional()  
  })

const updateCategorySchema =
  createCategorySchema.partial()

module.exports = {
  createCategorySchema,
  updateCategorySchema
}