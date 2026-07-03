const {
  getProfileService,
  updateProfileService
} = require(
  "../services/user.service"
)

const getProfile =
  async (req, res) => {

    try {

      const user =
        await getProfileService(
          req.user.id
        )

      res.status(200).json({

        success: true,

        user

      })

    } catch (error) {

      res.status(404).json({

        success: false,

        message:
          error.message

      })
    }
}
const updateProfile =
  async (req, res) => {

    try {

      const { name } =
        req.body

      const user =
        await updateProfileService(

          req.user.id,

          name

        )

      res.status(200).json({

        success: true,

        message:
          "Profile updated successfully",

        user

      })

    } catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message

      })
    }
}
module.exports = {
  getProfile,
  updateProfile
}