const prisma = require("../prisma/prisma")
const {
  generateId
} = require(
  "../utils/id-generator"
)

const hashPassword = require("../utils/hashPassword")

const comparePassword = require("../utils/comparePassword")

const registerUserService = async (
  name,
  email,
  password
) => {
  const existingUser =
    await prisma.user.findUnique({
      where: {
        email
      }
    })

  if (existingUser) {
    throw new Error("Email already exists")
  }

  const hashedPassword =
    await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      id:generateId("cus"),
      name,
      email,
      password: hashedPassword
    }
  })

  return user
}

const loginUserService = async (
  email,
  password
) => {
  const user =
    await prisma.user.findUnique({
      where: {
        email
      }
    })

  if (!user) {
    throw new Error("Invalid credentials")
  }

  const isPasswordValid =
    await comparePassword(
      password,
      user.password
    )

  if (!isPasswordValid) {
    throw new Error("Invalid credentials")
  }

  return user
}

module.exports = {
  registerUserService,
  loginUserService
}