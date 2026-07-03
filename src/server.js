require("dotenv").config()
const {
  connectRedis
} = require("./config/redis")
const app = require("./app")

const PORT =
  process.env.PORT || 5000
connectRedis()
const { ulid } = require("ulid")
console.log("ulid is ", ulid())
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  )
})