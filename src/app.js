const express = require("express")

const cors = require("cors")

const authRoutes = require(
  "./routes/auth.routes"
)

const productRoutes = require(
  "./routes/product.routes"
)
const categoryRoutes =
  require("./routes/category.routes")

const productOptionRoutes =
  require(
    "./routes/productOption.routes"
  )
const productVariantRoutes =
  require(
    "./routes/productVariant.routes"
  ) 
  const exportRoutes =
  require(
    "./routes/export.routes"
  )
const importRoutes =
  require(
    "./routes/import.routes"
  )
  const dashboardRoutes = require("./routes/dashboard.routes")
const userRoutes =
  require(
    "./routes/user.routes"
  )
  const addressRoutes =
  require(
    "./routes/address.routes"
  )
  const cartRoutes =
  require(
    "./routes/cart.routes"
  )
const orderRoutes =
  require(
    "./routes/order.routes"
  )
const adminOrderRoutes =
  require(
    "./routes/admin-order.routes"
  )
const paymentRoutes =
  require(
    "./routes/payment.routes"
  )
const adminCustomerRoutes=
   require(
    "./routes/customer.route"
   )
   const wishlistRoutes =
  require(
    "./routes/wishlist.route"
  )
const inventoryRoutes =
  require(
    "./routes/inventory.routes"
  )  
const reviewRoutes= require("./routes/review.route")
const returnRoutes =
  require(
    "./routes/return.routes"
  )      
const app = express()

app.use(cors())

app.use(express.json())

app.use(
  "/api/auth",
  authRoutes
)

app.use(
  "/api/products",
  productRoutes
)
app.use(
  "/api/categories",
  categoryRoutes
)
app.use(
  "/api/product-options",
  productOptionRoutes
)
app.use(
  "/api/product-variants",
  productVariantRoutes
)
app.use(
  "/api/export",
  exportRoutes
)
app.use(
  "/api/import",
  importRoutes
)
app.use(
  "/api/dashboard",
  dashboardRoutes
)
app.use(
  "/api/users",
  userRoutes
)
app.use(
  "/api/addresses",
  addressRoutes
)
app.use(
  "/api/cart",
  cartRoutes
)

app.use(
  "/api/orders",
  orderRoutes
)
app.use(
  "/api/admin/orders",
  adminOrderRoutes
)
app.use(
  "/api/payment",
  paymentRoutes
)
app.use(
  "/api/admin/customers",
  adminCustomerRoutes
)
app.use("/api/reviews",
  reviewRoutes
)
app.use(
  "/api/wishlist",
  wishlistRoutes
)
app.use("/api/inventory", inventoryRoutes)
app.use(
  "/api/returns",
  returnRoutes
)
module.exports = app