const {
  createProductService,

  getProductsService,

  getProductByIdService,

  updateProductService,

  deleteProductService,
  getProductBySlugService,
  getAllProductsForCategoryService,
  getRelatedProductsService
} = require("../services/product.service")

const createProduct = async (
  req,
  res
) => {
  try {
    const product =
      await createProductService(
        req.body,
        req.files
      )

    res.status(201).json({
      success: true,
      message:
        "Product created successfully",

      product
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

const getProducts = async (
  req,
  res
) => {
  try {

    const {
      search = "",
      status = "",
      page=1,
      limit=10,
      featured = false
    } = req.query

  const result =
  await getProductsService(
    search,
    status,
    Number(page),
    Number(limit),
    featured
  )

res.status(200).json({
  success: true,
  ...result
})

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
const getAllProductsForCategory =
  async (req, res) => {

    try {

      const products =

        await getAllProductsForCategoryService()

      res.status(200).json({

        success: true,

        products
      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message
      })
    }
}
const getProductById = async (
  req,
  res
) => {
  try {
    const product =
      await getProductByIdService(
        req.params.id
      )

    res.status(200).json({
      success: true,
      product
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    })
  }
}

const updateProduct =
  async (req, res) => {

    try {
           console.log(
        "REQ BODY:",
        req.body
      )
      const product =

        await updateProductService(

          req.params.id,

          req.body,
          req.files
        )

      res.status(200).json({

        success: true,

        message:
          "Product updated successfully",

        product
      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message
      })
    }
}

const deleteProduct = async (
  req,
  res
) => {
  try {
    await deleteProductService(
      req.params.id
    )

    res.status(200).json({
      success: true,
      message:
        "Product deleted successfully"
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}
const getProductBySlug =
  async (req, res) => {

    try {

      const product =
        await getProductBySlugService(
          req.params.slug
        )

      res.status(200).json({

        success: true,

        product

      })

    } catch (error) {

      res.status(404).json({

        success: false,

        message:
          error.message

      })
    }
}
const getRelatedProducts =
  async (req, res) => {

    try {

      const products =
        await getRelatedProductsService(
          req.params.id
        )

      res.status(200).json({

        success: true,

        products

      })

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      })

    }

}
module.exports = {
  createProduct,

  getProducts,

  getProductById,

  updateProduct,

  deleteProduct,
  getProductBySlug,
  getAllProductsForCategory,
  getRelatedProducts
}