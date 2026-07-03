const express =
  require("express")

const router =
  express.Router()

const {

  createInventory,
  reserveInventory,
  releaseReservation,
  shipReservation,
  getInventories,
  adjustInventory,
  getInventoryById,
  getInventoryHistory,
  deleteInventory

} = require(

  "../controllers/inventory.controller"

)

const authenticate =
  require(

    "../middlewares/auth.middleware"

  )

router.post(

  "/",

  authenticate,

  createInventory

)
router.post(

"/reserve",

authenticate,

reserveInventory

)
router.get(
  "/",
  authenticate,
  getInventories
)
router.get(

  "/history/:inventoryId",

  authenticate,

  getInventoryHistory

)
router.get("/:id" , authenticate , getInventoryById)
router.put("/release/:id" , authenticate , releaseReservation)
router.put("/ship/:id" , authenticate , shipReservation)
router.post("/adjust" , authenticate,adjustInventory)
router.delete( "/:id",authenticate, deleteInventory)
module.exports =
  router