const { ulid } = require("ulid")

const generateId =
  (prefix) => {

    return `${prefix}_${ulid()}`
  }

module.exports = {
  generateId
}