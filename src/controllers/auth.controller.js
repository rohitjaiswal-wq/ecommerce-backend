const {
  registerUserService,
  loginUserService
} = require("../services/auth.service")

const generateToken = require("../utils/generateToken")

const register = async (req, res) => {
  try {
    const { name, email, password } =
      req.body

    const user =
      await registerUserService(
        name,
        email,
        password
      )

    const token = generateToken(user)

    res.status(201).json({
      success: true,
      message:
        "User registered successfully",
      token,
      user
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } =
      req.body

    const user =
      await loginUserService(
        email,
        password
      )

    const token = generateToken(user)

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  register,
  login
}