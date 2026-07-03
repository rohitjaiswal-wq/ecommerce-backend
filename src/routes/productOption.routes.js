const express =
  require("express")

const router =
  express.Router()

const {

  createOption,

  createOptionValues,
  deleteOptionValue,
  deleteOption

} = require(
  "../controllers/productOption.controller"
)

const authenticate =
  require("../middlewares/auth.middleware")

const isAdmin =
  require("../middlewares/admin.middleware")

/*
  CREATE OPTION
*/

router.post(

  "/:productId",

  authenticate,

  isAdmin,

  createOption
)

/*
  CREATE OPTION VALUES
*/

router.post(

  "/values/:optionId",

  authenticate,

  isAdmin,

  createOptionValues
)
router.delete(

  "/values/:id",

  authenticate,

  isAdmin,

  deleteOptionValue
)
router.delete(

  "/:id",

  authenticate,

  isAdmin,

  deleteOption
) 
module.exports = router