const {

  createCategoryService,

  getCategoriesService,

  getCategoryByIdService,

  updateCategoryService,

  deleteCategoryService,

  assignProductsToCategoryService,

  getCategoryBySlugService

} = require("../services/category.service")

const {

  createCategorySchema,

  updateCategorySchema

} = require("../validations/category.validation")

const createCategory =
  async (req, res) => {

    try {

      const validated =
        createCategorySchema.parse(
          req.body
        )

      const category =
        await createCategoryService(
          validated,
           req.file
        )

      res.status(201).json({

        success: true,

        message:
          "Category created successfully",

        category
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message: error.message
      })
    }
}

const getCategories =
  async (req, res) => {

    try {

      const categories =
        await getCategoriesService()

      res.json({
        success: true,
        categories
      })

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      })
    }
}

const getCategoryById =
  async (req, res) => {

    try {

      const category =
        await getCategoryByIdService(
          req.params.id,
          req.file
        )

      res.json({
        success: true,
        category
      })

    } catch (error) {

      res.status(404).json({
        success: false,
        message: error.message
      })
    }
}

const updateCategory =
  async (req, res) => {

    try {

      const validated =
        updateCategorySchema.parse(
          req.body
        )

      const category =
        await updateCategoryService(
          req.params.id,
          validated
        )

      res.json({

        success: true,

        message:
          "Category updated successfully",

        category
      })

    } catch (error) {

      res.status(400).json({
        success: false,
        message: error.message
      })
    }
}

const deleteCategory =
  async (req, res) => {

    try {

      await deleteCategoryService(
        req.params.id
      )

      res.json({

        success: true,

        message:
          "Category deleted successfully"
      })

    } catch (error) {

      res.status(400).json({
        success: false,
        message: error.message
      })
    }
}
const assignProductsToCategory =
  async (req, res) => {

    try {

      const {
        productIds
      } = req.body

      await assignProductsToCategoryService(
        req.params.id,
        productIds
      )

      res.json({

        success: true,

        message:
          "Products assigned successfully"
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message: error.message
      })
    }
}
const getCategoryBySlug =
  async (req, res) => {

    try {

      const category =
        await getCategoryBySlugService(
          req.params.slug
        )

      res.status(200).json({

        success: true,

        category
      })

    } catch (error) {

      res.status(404).json({

        success: false,

        message:
          error.message
      })
    }
}
module.exports = {

  createCategory,

  getCategories,

  getCategoryById,

  updateCategory,

  deleteCategory,

  assignProductsToCategory,

  getCategoryBySlug
}